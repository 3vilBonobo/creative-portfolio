import { onMounted, onBeforeUnmount, ref, type Ref } from "vue";
import { findActiveFloor } from "../services/floorNavigation";

export function useActiveFloor(ids: readonly string[]): { activeFloor: Ref<string> } {
  const activeFloor = ref(ids[0] ?? "");
  let observer: ResizeObserver | undefined;
  let frame = 0;
  let mounted = false;
  let elements: HTMLElement[] = [];

  function update() {
    frame = 0;
    const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
    const referenceLine = Math.min(window.innerHeight / 2, Math.max(window.innerHeight / 4, headerBottom + 16));
    const positions = elements.map((element) => ({ id: element.id, top: element.getBoundingClientRect().top }));
    const pageEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    activeFloor.value = findActiveFloor(positions, referenceLine, pageEnd);
  }

  function scheduleUpdate() {
    if (mounted && !frame) frame = requestAnimationFrame(update);
  }

  onMounted(() => {
    mounted = true;
    elements = ids.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    observer = new ResizeObserver(scheduleUpdate);
    elements.forEach((element) => observer!.observe(element));
    observer.observe(document.body);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    void document.fonts.ready.then(scheduleUpdate);
    scheduleUpdate();
  });

  onBeforeUnmount(() => {
    mounted = false;
    cancelAnimationFrame(frame);
    observer?.disconnect();
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    window.removeEventListener("hashchange", scheduleUpdate);
    window.removeEventListener("pageshow", scheduleUpdate);
  });

  return { activeFloor };
}
