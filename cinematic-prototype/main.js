import gsap from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

// The adjacent-floor value is the author's approved GSAP reference timing.
export const cinematicMotion = { duration: 1.25, ease: "power1.inOut" };
const labels = ["04 / ROOFTOP", "03 / ABOUT", "02 / PROJECTS", "01 / EXPERIENCE", "00 / STREET"];
const floors = [...document.querySelectorAll(".floor")];
const buttons = [...document.querySelectorAll("[data-floor]")];
const building = document.querySelector("#building");
const toggle = document.querySelector("#mode-toggle");
const floorStatus = document.querySelector("#status-floor");
const stateStatus = document.querySelector("#status-state");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const listeners = new AbortController();
let activeIndex = 0;
let destinationIndex = 0;
let travel;
let observer;
let panelGestureConsumed = false;
let touchStart;
const panelPositions = new WeakMap([...document.querySelectorAll("[data-native-scroll]")].map(panel => [panel, panel.scrollTop]));

const cameraY = index => -floors[index].offsetTop;
const atEdge = (element, direction) => {
  if (element.scrollHeight <= element.clientHeight + 2) return true;
  return direction > 0
    ? element.scrollTop + element.clientHeight >= element.scrollHeight - 2
    : element.scrollTop <= 2;
};

function updateUI(index, travelling = false) {
  floors.forEach((floor, floorIndex) => floor.toggleAttribute("data-active", floorIndex === index && !travelling));
  document.body.classList.toggle("is-travelling", travelling);
  buttons.forEach((button, buttonIndex) => {
    if (buttonIndex === index && !travelling) button.setAttribute("aria-current", "location");
    else button.removeAttribute("aria-current");
    if (buttonIndex === index && travelling) button.setAttribute("data-destination", "");
    else button.removeAttribute("data-destination");
  });
  floorStatus.textContent = labels[index];
  stateStatus.textContent = travelling ? "TRAVELLING" : document.body.dataset.mode === "native" ? "NATIVE" : "READY";
}

function travelTo(index, explicit = false) {
  if (index < 0 || index >= floors.length || document.body.dataset.mode !== "cinematic") return;
  if (!explicit && travel) return;
  if (index === activeIndex && !travel) return;

  travel?.kill();
  destinationIndex = index;
  updateUI(index, true);
  const currentY = Number(gsap.getProperty(building, "y")) || 0;
  const targetY = cameraY(index);
  const step = floors[1].offsetTop - floors[0].offsetTop;
  const distance = Math.abs(targetY - currentY) / step;
  // Direct jumps cross every shaft in one uninterrupted move. Timing is for author review.
  const duration = Math.abs(index - activeIndex) === 1 && Math.abs(currentY - cameraY(activeIndex)) < 2
    ? cinematicMotion.duration
    : Math.min(2.25, cinematicMotion.duration + Math.max(0, distance - 1) * 0.25);

  travel = gsap.timeline({
    defaults: { duration, ease: cinematicMotion.ease },
    onComplete: () => {
      travel = undefined;
      activeIndex = index;
      updateUI(index);
    },
  }).to(building, { y: targetY }, 0);
}

function navigate(direction, event) {
  if (document.body.dataset.mode !== "cinematic" || travel) return;
  const target = event?.target;
  if (target instanceof Element && target.closest(".chrome, .elevator")) return;
  const panel = target instanceof Element ? target.closest("[data-native-scroll]") : null;
  if (panel && panel.closest(".floor") === floors[activeIndex]) {
    if (panelGestureConsumed) return;
    if (event instanceof TouchEvent && touchStart?.panel === panel) {
      const startedAtEdge = direction > 0
        ? touchStart.top + panel.clientHeight >= touchStart.height - 2
        : touchStart.top <= 2;
      if (!startedAtEdge) return;
    } else if (!atEdge(panel, direction)) return;
  }
  travelTo(activeIndex + direction);
}

function setMode(mode) {
  if (mode === "cinematic" && reducedMotion.matches) mode = "native";
  travel?.kill();
  travel = undefined;
  document.body.classList.remove("is-travelling");
  document.body.dataset.mode = mode;
  if (mode === "native") {
    observer?.disable();
    gsap.set(building, { clearProps: "transform" });
    requestAnimationFrame(() => floors[activeIndex].scrollIntoView({ behavior: "instant" }));
    toggle.textContent = reducedMotion.matches ? "Reduced motion · native" : "Cinematic movement";
    toggle.setAttribute("aria-pressed", "true");
    toggle.disabled = reducedMotion.matches;
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
    gsap.set(building, { y: cameraY(activeIndex) });
    observer?.enable();
    toggle.textContent = "Native scrolling";
    toggle.setAttribute("aria-pressed", "false");
    toggle.disabled = false;
  }
  updateUI(activeIndex);
}

observer = Observer.create({
  type: "wheel,touch",
  wheelSpeed: -1,
  tolerance: 10,
  preventDefault: false,
  onStopDelay: 0.2,
  onStop: () => { panelGestureConsumed = false; touchStart = undefined; },
  onUp: self => navigate(1, self.event),
  onDown: self => navigate(-1, self.event),
});

// Read the panel position before native wheel scrolling consumes the event.
window.addEventListener("wheel", event => {
  const panel = event.target instanceof Element ? event.target.closest("[data-native-scroll]") : null;
  if (panel?.closest(".floor") === floors[activeIndex]) {
    const previousTop = panelPositions.get(panel) ?? panel.scrollTop;
    if (Math.abs(panel.scrollTop - previousTop) > 2 || !atEdge(panel, Math.sign(event.deltaY))) {
      panelGestureConsumed = true;
    }
    panelPositions.set(panel, panel.scrollTop);
  }
}, { capture: true, passive: true, signal: listeners.signal });
window.addEventListener("touchstart", event => {
  const panel = event.target instanceof Element ? event.target.closest("[data-native-scroll]") : null;
  touchStart = panel ? { panel, top: panel.scrollTop, height: panel.scrollHeight } : undefined;
}, { capture: true, passive: true, signal: listeners.signal });

buttons.forEach(button => button.addEventListener("click", () => {
  const index = Number(button.dataset.floor);
  if (document.body.dataset.mode === "native") {
    activeIndex = index;
    floors[index].scrollIntoView({ behavior: "instant" });
    updateUI(index);
  } else travelTo(index, true);
}, { signal: listeners.signal }));

toggle.addEventListener("click", () => setMode(document.body.dataset.mode === "native" ? "cinematic" : "native"), { signal: listeners.signal });
reducedMotion.addEventListener("change", () => { if (reducedMotion.matches) setMode("native"); else toggle.disabled = false; }, { signal: listeners.signal });
window.addEventListener("resize", () => {
  if (document.body.dataset.mode === "cinematic") {
    travel?.kill();
    travel = undefined;
    activeIndex = destinationIndex;
    gsap.set(building, { y: cameraY(activeIndex) });
    updateUI(activeIndex);
  }
}, { signal: listeners.signal });
document.addEventListener("keydown", event => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  if (document.body.dataset.mode !== "cinematic" || (event.target instanceof Element && event.target.closest("button, input, textarea, select, [data-native-scroll]"))) return;
  event.preventDefault();
  travelTo(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
}, { signal: listeners.signal });

// Environmental motion stays independent of travel and can be removed without changing navigation.
const environment = gsap.to(".skyline i", { opacity: 0.45, duration: 2.2, repeat: -1, yoyo: true, stagger: 0.18 });
window.addEventListener("pagehide", () => { travel?.kill(); environment.kill(); observer?.kill(); listeners.abort(); }, { once: true });
setMode(reducedMotion.matches ? "native" : "cinematic");
