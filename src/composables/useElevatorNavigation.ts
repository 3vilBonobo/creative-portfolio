import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { FLOORS } from "../config/floors";

/** Author-approved timing for an adjacent architectural floor. */
export const cinematicMotion = { duration: 1.25, ease: "power1.inOut" } as const;

export function useElevatorNavigation() {
  const activeFloor = ref<string>(FLOORS[0].id);
  const cinematicActive = ref(false);
  let query: MediaQueryList | undefined;
  let building: HTMLElement | null = null;
  let sections: HTMLElement[] = [];
  let activeIndex = 0;
  let destinationIndex = 0;
  let travel: gsap.core.Timeline | undefined;
  let observer: Observer | undefined;
  let panelGestureConsumed = false;
  let touchStart: { panel: HTMLElement; top: number; height: number } | undefined;
  const panelPositions = new WeakMap<HTMLElement, number>();

  // offsetTop rounds away fractional separator heights, leaving a visible last-pixel settle.
  const cameraY = (index: number) => {
    const section = sections[index];
    if (!section || !building) return 0;
    return -(section.getBoundingClientRect().top - building.getBoundingClientRect().top);
  };
  const modalOpen = () => Boolean(document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]'));
  const isScrollable = (element: HTMLElement) => {
    const overflow = getComputedStyle(element).overflowY;
    return (overflow === "auto" || overflow === "scroll") && element.scrollHeight > element.clientHeight + 2;
  };
  const atEdge = (element: HTMLElement, direction: number) => direction > 0
    ? element.scrollTop + element.clientHeight >= element.scrollHeight - 2
    : element.scrollTop <= 2;
  const scrollChain = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return [];
    const section = target.closest<HTMLElement>(".floor-section");
    if (section !== sections[activeIndex]) return [];
    const chain: HTMLElement[] = [];
    for (let node: HTMLElement | null = target as HTMLElement; node; node = node.parentElement) {
      if (isScrollable(node)) chain.push(node);
      if (node === section) break;
    }
    return chain;
  };
  const updateActive = (index: number) => {
    activeIndex = index;
    destinationIndex = index;
    activeFloor.value = FLOORS[index].id;
    sections.forEach((section, sectionIndex) => section.toggleAttribute("data-camera-active", sectionIndex === index));
    document.documentElement.classList.remove("camera-travelling");
  };
  const settleAt = (index: number) => {
    travel?.kill();
    travel = undefined;
    if (building) gsap.set(building, { y: cameraY(index) });
    updateActive(index);
  };
  const travelTo = (index: number, explicit = false) => {
    if (!cinematicActive.value || !building || index < 0 || index >= sections.length || modalOpen()) return;
    if (travel && !explicit) return;
    if (index === activeIndex && !travel) return;
    travel?.kill();
    destinationIndex = index;
    activeFloor.value = FLOORS[index].id;
    sections.forEach(section => section.removeAttribute("data-camera-active"));
    document.documentElement.classList.add("camera-travelling");
    const currentY = Number(gsap.getProperty(building, "y")) || 0;
    const targetY = cameraY(index);
    const step = Math.max(1, sections[1].offsetTop - sections[0].offsetTop);
    const distance = Math.abs(targetY - currentY) / step;
    const adjacent = Math.abs(index - activeIndex) === 1 && Math.abs(currentY - cameraY(activeIndex)) < 2;
    const duration = adjacent ? cinematicMotion.duration
      : Math.min(2.25, cinematicMotion.duration + Math.max(0, distance - 1) * 0.25);
    travel = gsap.timeline({
      defaults: { duration, ease: cinematicMotion.ease },
      onComplete: () => { travel = undefined; updateActive(index); },
    }).to(building, { y: targetY }, 0);
  };
  const navigate = (direction: number, event: Event | undefined) => {
    if (!cinematicActive.value || travel || modalOpen()) return;
    if (event?.target instanceof Element && event.target.closest(".site-header, .floor-nav")) return;
    const chain = scrollChain(event?.target ?? null);
    if (panelGestureConsumed) return;
    for (const panel of chain) {
      if (event instanceof TouchEvent && touchStart?.panel === panel) {
        const startedAtEdge = direction > 0
          ? touchStart.top + panel.clientHeight >= touchStart.height - 2 : touchStart.top <= 2;
        if (!startedAtEdge) return;
      } else if (!atEdge(panel, direction)) return;
    }
    travelTo(activeIndex + direction);
  };
  const onWheelCapture = (event: WheelEvent) => {
    if (!cinematicActive.value || modalOpen()) return;
    const direction = Math.sign(event.deltaY);
    for (const panel of scrollChain(event.target)) {
      const previous = panelPositions.get(panel) ?? panel.scrollTop;
      if (Math.abs(panel.scrollTop - previous) > 2 || !atEdge(panel, direction)) panelGestureConsumed = true;
      panelPositions.set(panel, panel.scrollTop);
    }
  };
  const onTouchStart = (event: TouchEvent) => {
    const panel = scrollChain(event.target)[0];
    touchStart = panel ? { panel, top: panel.scrollTop, height: panel.scrollHeight } : undefined;
  };
  const onClick = (event: MouseEvent) => {
    if (!cinematicActive.value || !(event.target instanceof Element) || event.defaultPrevented || event.button !== 0
      || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;
    if (anchor.hash === "#main-content") {
      event.preventDefault();
      building?.focus({ preventScroll: true });
      return;
    }
    const index = FLOORS.findIndex(floor => floor.id === decodeURIComponent(anchor.hash.slice(1)));
    if (index < 0) return;
    event.preventDefault();
    history.pushState(null, "", anchor.hash);
    travelTo(index, true);
  };
  const onKey = (event: KeyboardEvent) => {
    if (!cinematicActive.value) return;
    if (event.key === "Escape" && travel) {
      settleAt(activeIndex);
      history.replaceState(null, "", `#${FLOORS[activeIndex].id}`);
      return;
    }
    if ((event.key !== "ArrowDown" && event.key !== "ArrowUp") || modalOpen()) return;
    if (event.target instanceof Element && event.target.closest("button, a, input, textarea, select, [role='tab'], .floor-section")) return;
    event.preventDefault();
    travelTo(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
  };
  const onHistory = () => {
    if (!cinematicActive.value) return;
    const index = FLOORS.findIndex(floor => `#${floor.id}` === location.hash);
    if (index >= 0) travelTo(index, true);
  };
  const activate = () => {
    if (!building || cinematicActive.value || !query?.matches) return;
    const hashIndex = FLOORS.findIndex(floor => `#${floor.id}` === location.hash);
    const nearest = sections.reduce((best, section, index) =>
      Math.abs(section.offsetTop - scrollY) < Math.abs(sections[best].offsetTop - scrollY) ? index : best, 0);
    const index = hashIndex >= 0 ? hashIndex : nearest;
    panelGestureConsumed = false;
    touchStart = undefined;
    cinematicActive.value = true;
    document.documentElement.classList.add("cinematic-mode");
    window.scrollTo({ top: 0, behavior: "instant" });
    gsap.set(building, { y: cameraY(index) });
    updateActive(index);
    observer = Observer.create({
      type: "wheel,touch", wheelSpeed: -1, tolerance: 10, preventDefault: false, onStopDelay: 0.2,
      onStop: () => { panelGestureConsumed = false; touchStart = undefined; },
      onUp: self => navigate(1, self.event), onDown: self => navigate(-1, self.event),
    });
  };
  const deactivate = () => {
    if (!cinematicActive.value) return;
    observer?.kill(); observer = undefined;
    travel?.kill(); travel = undefined;
    panelGestureConsumed = false;
    touchStart = undefined;
    cinematicActive.value = false;
    document.documentElement.classList.remove("cinematic-mode", "camera-travelling");
    sections.forEach(section => section.removeAttribute("data-camera-active"));
    if (building) gsap.set(building, { clearProps: "transform" });
    requestAnimationFrame(() => window.scrollTo({ top: sections[activeIndex]?.offsetTop ?? 0, behavior: "instant" }));
  };
  const syncMode = () => { if (query?.matches) activate(); else deactivate(); };
  const onResize = () => { if (cinematicActive.value) settleAt(destinationIndex); };

  onMounted(() => {
    gsap.registerPlugin(Observer);
    building = document.getElementById("main-content");
    sections = FLOORS.map(floor => document.getElementById(floor.id)).filter((section): section is HTMLElement => section instanceof HTMLElement);
    if (sections.length !== FLOORS.length) return;
    query = matchMedia("(min-width: 1101px) and (prefers-reduced-motion: no-preference)");
    query.addEventListener("change", syncMode);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheelCapture, { capture: true, passive: true });
    window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
    window.addEventListener("popstate", onHistory);
    window.addEventListener("hashchange", onHistory);
    window.addEventListener("resize", onResize);
    syncMode();
  });
  onBeforeUnmount(() => {
    deactivate();
    query?.removeEventListener("change", syncMode);
    document.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("wheel", onWheelCapture, true);
    window.removeEventListener("touchstart", onTouchStart, true);
    window.removeEventListener("popstate", onHistory);
    window.removeEventListener("hashchange", onHistory);
    window.removeEventListener("resize", onResize);
  });
  return { activeFloor, cinematicActive };
}
