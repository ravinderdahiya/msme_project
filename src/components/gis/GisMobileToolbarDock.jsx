import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SCROLL_STEP = 200;
import { GIS_PHONE_MAX_PX } from "../../gis/msme/gisShellBreakpoints.js";

const MOBILE_TOOLBAR_BP = GIS_PHONE_MAX_PX;

function useCompactToolbar() {
  const [compact, setCompact] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${MOBILE_TOOLBAR_BP}px)`).matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_TOOLBAR_BP}px)`);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return compact;
}

export default function GisMobileToolbarDock() {
  const viewportRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const compact = useCompactToolbar();

  const syncScrollState = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflow = scrollWidth > clientWidth + 4;
    setHasOverflow(overflow);
    setCanScrollLeft(overflow && scrollLeft > 4);
    setCanScrollRight(overflow && scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const scheduleSync = () => window.requestAnimationFrame(syncScrollState);

    scheduleSync();
    el.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    const delays = [120, 400, 900, 1800, 3200].map((ms) => window.setTimeout(scheduleSync, ms));

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(scheduleSync);
      ro.observe(el);
      if (el.firstElementChild) ro.observe(el.firstElementChild);
    }

    const mo = new MutationObserver(scheduleSync);
    mo.observe(el, { childList: true, subtree: true, attributes: true });

    const root = document.getElementById("msmeGisRoot");
    let rootMo = null;
    if (root) {
      rootMo = new MutationObserver(scheduleSync);
      rootMo.observe(root, { attributes: true, attributeFilter: ["class"], subtree: false });
    }

    return () => {
      el.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      delays.forEach((id) => window.clearTimeout(id));
      if (ro) ro.disconnect();
      mo.disconnect();
      if (rootMo) rootMo.disconnect();
    };
  }, [syncScrollState, compact]);

  const scrollBy = useCallback(
    (dir) => {
      const el = viewportRef.current;
      if (!el) return;
      el.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
      window.setTimeout(syncScrollState, 320);
    },
    [syncScrollState]
  );

  const showArrows = compact && hasOverflow;

  return (
    <div id="msmeGisMapToolbarDock" className="msme-gis-map-toolbar-dock" aria-label="Map tools">
      <div
        className={`msme-gis-toolbar-scroll-wrap${showArrows ? " has-arrows" : ""}${
          canScrollLeft ? " can-scroll-left" : ""
        }${canScrollRight ? " can-scroll-right" : ""}`}
      >
        {showArrows ? (
          <button
            type="button"
            className="msme-gis-toolbar-scroll-btn msme-gis-toolbar-scroll-btn--prev"
            aria-label="Scroll tools left"
            aria-hidden={!canScrollLeft}
            tabIndex={canScrollLeft ? 0 : -1}
            onClick={() => scrollBy(-1)}
          >
            <ChevronLeft size={20} strokeWidth={2.25} aria-hidden="true" />
          </button>
        ) : null}

        <div ref={viewportRef} className="msme-gis-toolbar-scroll-viewport">
          <div className="msme-gis-header-toolbar" aria-label="Map tools" />
        </div>

        {showArrows ? (
          <button
            type="button"
            className="msme-gis-toolbar-scroll-btn msme-gis-toolbar-scroll-btn--next"
            aria-label="Scroll tools right"
            aria-hidden={!canScrollRight}
            tabIndex={canScrollRight ? 0 : -1}
            onClick={() => scrollBy(1)}
          >
            <ChevronRight size={20} strokeWidth={2.25} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
