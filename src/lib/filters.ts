export function dateRangeToISO(
  range: string,
): string | undefined {
  const now = new Date();
  let d: Date;

  switch (range) {
    case "last-week":
      d = new Date(now);
      d.setDate(d.getDate() - 7);
      break;
    case "last-month":
      d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      break;
    case "last-3-months":
      d = new Date(now);
      d.setMonth(d.getMonth() - 3);
      break;
    case "this-year":
      d = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return undefined;
  }

  return d.toISOString();
}

export function readTimeToRange(
  value: string,
): { min?: number; max?: number } | undefined {
  switch (value) {
    case "under-5":
      return { max: 4 };
    case "5-10":
      return { min: 5, max: 10 };
    case "over-10":
      return { min: 11 };
    default:
      return undefined;
  }
}
