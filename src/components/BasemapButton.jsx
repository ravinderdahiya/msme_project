import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BasemapGalleryViewModel from "@arcgis/core/widgets/BasemapGallery/BasemapGalleryViewModel.js";
import { watch } from "@arcgis/core/core/reactiveUtils.js";
import { getBasemapThumbnailUrl } from "@arcgis/core/support/basemapUtils.js";
import { getAssetUrl } from "@arcgis/core/assets.js";
import { useHeaderToolbarHost } from "../gis/msme/msmeGisHeaderToolbarMount.js";

function fallbackThumbnailUrl() {
  try {
    return getAssetUrl("esri/themes/base/images/basemap-toggle-64.svg");
  } catch {
    return "";
  }
}

export default function BasemapButton({ t }) {
  const hostRef = useRef(null);
  const toolbarHost = useHeaderToolbarHost();
  const menuRef = useRef(null);
  const galleryVmRef = useRef(null);
  const watchHandleRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [busyUid, setBusyUid] = useState(null);
  const [menuPos, setMenuPos] = useState(null);
  const [galleryState, setGalleryState] = useState({
    vmState: "disabled",
    rows: [],
    activeIndex: -1,
  });

  const rawLabel = (t && typeof t === "function" ? t("basemap") : null) || "Basemap";
  const label = rawLabel ? String(rawLabel).trim() : "Basemap";
  const labelTitle = label ? label.charAt(0).toUpperCase() + label.slice(1) : "Basemap";

  const measureMenu = useCallback(() => {
    const el = hostRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = typeof window !== "undefined" ? window.innerWidth : 400;
    const vh = typeof window !== "undefined" ? window.innerHeight : 600;
    const margin = 10;
    const width = Math.min(320, Math.max(220, vw - margin * 2));
    let left = r.right - width;
    left = Math.max(margin, Math.min(left, vw - width - margin));
    let top = r.bottom + 8;
    const maxH = Math.min(360, vh - top - margin);
    if (maxH < 120) {
      top = Math.max(margin, r.top - Math.min(360, vh - margin * 2));
    }
    setMenuPos({ top, left, width, maxHeight: Math.min(360, vh - top - margin) });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null);
      return;
    }
    measureMenu();
    const onResizeScroll = () => measureMenu();
    window.addEventListener("resize", onResizeScroll);
    window.addEventListener("scroll", onResizeScroll, true);
    return () => {
      window.removeEventListener("resize", onResizeScroll);
      window.removeEventListener("scroll", onResizeScroll, true);
    };
  }, [open, measureMenu]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const node = e.target;
      if (hostRef.current?.contains(node) || menuRef.current?.contains(node)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /** Same basemap list + thumbnails as ArcGIS BasemapGallery (PortalBasemapsSource default). */
  useEffect(() => {
    let cancelled = false;
    let pollId = null;

    function clearWatch() {
      if (watchHandleRef.current) {
        try {
          watchHandleRef.current.remove();
        } catch {
          /* ignore */
        }
        watchHandleRef.current = null;
      }
    }

    function destroyVm() {
      clearWatch();
      const vm = galleryVmRef.current;
      galleryVmRef.current = null;
      if (vm) {
        try {
          vm.destroy();
        } catch {
          /* ignore */
        }
      }
    }

    function attach(view) {
      if (cancelled || galleryVmRef.current || !view || view.destroyed) return;
      const vm = new BasemapGalleryViewModel({ view });
      galleryVmRef.current = vm;

      const fallbackThumb = fallbackThumbnailUrl();

      function itemsSnapshot() {
        const col = vm.items;
        if (!col) return [];
        if (typeof col.toArray === "function") return col.toArray();
        return Array.from(col);
      }

      vm.load()
        .then(() => {
          if (cancelled) return;
          watchHandleRef.current = watch(
            () => {
              const state = vm.state;
              const activeIndex = vm.activeBasemapIndex;
              const items = itemsSnapshot();
              const rows = items.map((item, index) => ({
                uid: String(item.uid),
                index,
                title: item.basemap?.title || "",
                thumbnailUrl: getBasemapThumbnailUrl(item.basemap) || fallbackThumb,
                state: item.state,
              }));
              return { vmState: state, rows, activeIndex };
            },
            (snap) => {
              if (!cancelled) setGalleryState(snap);
            },
            { sync: false, initial: true }
          );
        })
        .catch((err) => {
          console.warn("[BasemapButton] BasemapGalleryViewModel.load failed", err);
        });
    }

    function tick() {
      if (cancelled) return;
      const view = typeof window !== "undefined" ? window.__msmeGisMapView : null;
      if (view && !view.destroyed && !galleryVmRef.current) {
        attach(view);
      }
      if (galleryVmRef.current && view && view.destroyed) {
        destroyVm();
        if (!cancelled) setGalleryState({ vmState: "disabled", rows: [], activeIndex: -1 });
      }
    }

    tick();
    pollId = window.setInterval(tick, 400);

    return () => {
      cancelled = true;
      if (pollId) window.clearInterval(pollId);
      destroyVm();
      setGalleryState({ vmState: "disabled", rows: [], activeIndex: -1 });
    };
  }, []);

  const toggleOpen = useCallback((ev) => {
    if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
    if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
    setOpen((v) => !v);
  }, []);

  const selectBasemap = useCallback(
    (uid) => {
      const vm = galleryVmRef.current;
      if (!vm) {
        window.alert((t && t("basemapMapNotReady")) || "Map is still loading. Try again in a moment.");
        setOpen(false);
        return;
      }
      const col = vm.items;
      const items = !col ? [] : typeof col.toArray === "function" ? col.toArray() : Array.from(col);
      const item = items.find((it) => String(it.uid) === String(uid));
      if (!item || item.state !== "ready") return;
      setBusyUid(uid);
      try {
        vm.activeBasemap = item.basemap;
        setOpen(false);
      } catch (err) {
        console.warn("[BasemapButton] set activeBasemap failed", err);
        window.alert((t && t("basemapSwitchFailed")) || "Could not change basemap. Please try again.");
      } finally {
        setBusyUid(null);
      }
    },
    [t]
  );

  const { vmState, rows, activeIndex } = galleryState;
  const loading = vmState === "loading" || (vmState === "ready" && rows.length === 0);

  const host = (
    <div ref={hostRef} className="msme-basemap-fab-host esri-component">
      <button
        type="button"
        id="basemapFab"
        className={`buffer-map-fab basemap-map-fab esri-component esri-widget--button${open ? " is-open" : ""}`}
        data-map-label={labelTitle}
        aria-label={labelTitle}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? "msme-basemap-dd-list" : undefined}
        onClick={toggleOpen}
      >
        <svg viewBox="0 0 24 24" className="buffer-map-fab-ico" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M4.5 4.5h7v7h-7v-7zm8 0h7v7h-7v-7zm-8 8h7v7h-7v-7zm8 0h7v7h-7v-7z"
          />
        </svg>
      </button>

      {open &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            id="msme-basemap-dd-list"
            className="msme-basemap-dd"
            role="listbox"
            aria-label={labelTitle}
            style={{
              position: "fixed",
              top: `${menuPos.top}px`,
              left: `${menuPos.left}px`,
              width: `${menuPos.width}px`,
              maxHeight: `${menuPos.maxHeight}px`,
              zIndex: 10040,
            }}
          >
            <div className="msme-basemap-dd-title">{(t && t("basemapChoose")) || "Base map"}</div>
            {loading ? (
              <div className="msme-basemap-dd-loading" role="status">
                {(t && t("basemapGalleryLoading")) || "Loading basemaps…"}
              </div>
            ) : vmState === "disabled" ? (
              <div className="msme-basemap-dd-loading" role="status">
                {(t && t("basemapMapNotReady")) || "Map is still loading. Try again in a moment."}
              </div>
            ) : (
              <ul className="msme-basemap-dd-list" role="none">
                {rows.map((row) => {
                  const isActive = activeIndex === row.index;
                  const disabled = !!busyUid || row.state !== "ready";
                  return (
                    <li key={row.uid} role="none">
                      <button
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={`msme-basemap-dd-item${isActive ? " is-active" : ""}`}
                        disabled={disabled}
                        onClick={() => selectBasemap(row.uid)}
                      >
                        <span className="msme-basemap-dd-thumb-wrap" aria-hidden>
                          <img
                            className="msme-basemap-dd-thumb-img"
                            src={row.thumbnailUrl}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                          {busyUid === row.uid ? <span className="msme-basemap-dd-busy" /> : null}
                        </span>
                        <span className="msme-basemap-dd-item-text">
                          {busyUid === row.uid ? "…" : row.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>,
          document.body
        )}
    </div>
  );

  return toolbarHost ? createPortal(host, toolbarHost) : host;
}
