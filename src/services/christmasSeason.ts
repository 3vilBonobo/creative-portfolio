// The portfolio's seasonal calendar follows Athens, like its room clock.
const calendar = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Athens", month: "numeric", day: "numeric",
});

export function isChristmasSeason(date: Date): boolean {
  if (!Number.isFinite(date.getTime())) return false;
  const parts = calendar.formatToParts(date);
  const month = Number(parts.find(part => part.type === "month")?.value);
  const day = Number(parts.find(part => part.type === "day")?.value);
  return month === 12 || (month === 1 && day <= 7);
}
