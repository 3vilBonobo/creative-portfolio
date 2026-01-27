import { onMounted, onBeforeUnmount, ref } from "vue";

export function useActiveFloor(ids = []) {
  const activeFloor = ref(ids[0] ?? null);
  let observer = null;

  onMounted(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (!elements.length) return;

    observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest visibility
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) activeFloor.value = visible.target.id;
      },
      {
        // This makes the "current floor" feel stable
        threshold: [0.35, 0.5, 0.65],
        root: null,
      },
    );

    elements.forEach((el) => observer.observe(el));
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });

  return { activeFloor };
}
