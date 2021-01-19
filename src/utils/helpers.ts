export function capFormat(
  item: string,
  options?: {
    allCaps?: boolean;
    isPlural?: boolean;
  }
): string {
  const addS = `${options?.isPlural ? "s" : ""}`;
  if (options?.allCaps) {
    return item.toUpperCase() + addS;
  } else {
    const firstItem = item.charAt(0).toUpperCase();
    return `${firstItem}${item.slice(1)}${addS}`;
  }
}
