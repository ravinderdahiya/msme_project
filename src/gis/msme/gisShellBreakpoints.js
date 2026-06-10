/** GIS map shell width breakpoints (width-based only — no device detection). */
export const GIS_PHONE_MAX_PX = 767;
export const GIS_TABLET_MAX_PX = 1024;
/** Phone + tablet: floating search, map toolbar dock, bottom-sheet menu (iPad Mini layout). */
export const GIS_COMPACT_SHELL_MAX_PX = GIS_TABLET_MAX_PX;
export const GIS_DESKTOP_MIN_PX = GIS_TABLET_MAX_PX + 1;

export function matchCompactShell() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${GIS_COMPACT_SHELL_MAX_PX}px)`).matches
  );
}

export function matchPhoneShell() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${GIS_PHONE_MAX_PX}px)`).matches
  );
}
