# MSME Haryana GIS Frontend

This repository contains the **MSME Haryana web frontend** built with **React + Vite** and a large **ArcGIS-based GIS module**.

## 1) What This Project Does

- Public/portal pages: homepage, login/signup, about/contact, admin UIs.
- GIS map page (`/msme-gis-map`) with ArcGIS operations like:
  - AOI selection (district/tehsil/village/cadastral)
  - Buffer/proximity/nearby analysis
  - Feature identify, selection, routing, reporting
- Alternate map demo UIs (`/demo-map`, `/newmainmap`) using Leaflet/custom map shell.
- i18n-ready labels (English/Hindi style support via local strings/context).

## 2) Tech Stack

- **Frontend**: React 18, Vite 8
- **GIS SDK**: `@arcgis/core` 4.29
- **Map (alternate demo)**: Leaflet + React-Leaflet
- **HTTP**: Axios + Fetch
- **Charts/UI utilities**: Chart.js, Recharts, Framer Motion, Remixicon, React-Toastify
- **Styling**: CSS files + Tailwind tooling present

## 3) High-Level Architecture (Frontend -> Backend -> GIS Services)

### Frontend layers

- `src/main.jsx` boots React app and i18n provider.
- `src/App.jsx` defines all routes.
- `src/pages/MSMEMapPage.jsx` mounts GIS shell and initializes ArcGIS runtime.
- `src/gis/msmeWebGis.js` is thin entry to GIS runtime loader.
- `src/gis/msme/*` contains GIS helper modules and runtime orchestration.

### Backend/API touchpoints (from frontend code)

This repo is primarily frontend. Backend code is **not included** here, but frontend expects:

- `http://localhost:8080`
  - `POST /otp/send-otp`
  - `POST /otp/verify-otp`
- `http://localhost:5000/api`
  - `/users` CRUD-style usage in `src/services/api.js`
- `http://localhost:5000/api/auth/register`
  - register call in `src/components/Register.js`

### External GIS services

- ArcGIS Map/Feature services hosted on `https://hsacggm.in/...`
- Optional route/geocode services (ArcGIS geocode, OSM/Nominatim fallback, OSRM fallback)

## 4) Environment Variables

Create/update `.env` in project root:

```env
REACT_APP_API_URL=http://localhost:8080
VITE_SERVER_URL=http://localhost:8080
VITE_ARCGIS_API_KEY=
VITE_ARCGIS_ROUTE_SERVICE_URL=
VITE_ARCGIS_USE_PROXY=false
VITE_ARCGIS_SERVICE_ROOT=
```

Notes:

- `VITE_ARCGIS_API_KEY` is recommended for stable ArcGIS routing/geocoding behavior.
- Dev proxy is configured in `vite.config.js` for `/arcgis` -> `https://hsacggm.in`.

## 5) How To Start The Project

### Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open:

- Main app: `http://localhost:5173`
- GIS page: `http://localhost:5173/msme-gis-map`

### Production build

```bash
npm run build
npm run preview
```

## 6) Full Folder Structure (Repo)

> Generated/large folders like `node_modules`, `dist`, `.git`, `.codex-backups` are runtime or tooling artifacts.

```text
msme_project/
|-- .env
|-- .gitignore
|-- eslint.config.js
|-- index.html
|-- package.json
|-- package-lock.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vite.config.js
|-- tmp_inv_layer.json
|-- README.md
|-- public/
|   |-- background.jpg
|   |-- background1.jpg
|   |-- background2.jpg
|   |-- background4.jpeg
|   |-- desicion.png
|   |-- electricity.jpg
|   |-- environment.png
|   |-- facilites.png
|   |-- favicon.ico
|   |-- govtlogo.png
|   |-- HARSAC-Logo.png
|   |-- haryana-state.geojson
|   |-- haryana.geojson
|   |-- haryana_boundry.geojson
|   |-- har_govt.png
|   |-- hepc-logo.png
|   |-- hepc_logo_tranparent.jpg.jpeg
|   |-- insight.png
|   |-- landicon.jpg
|   |-- login image.png
|   |-- logo-hewp.png
|   |-- logo192.png
|   |-- logo512.png
|   |-- manifest.json
|   |-- map-bg.png
|   |-- map.png
|   |-- msmemap.png
|   |-- road.png
|   |-- robots.txt
|   |-- security.png
|   |-- watersuppply.png
|   |-- zone.png
|   |-- data/
|   |   |-- haryana-districts.geojson
|   |   `-- haryana-state.geojson
|   |-- images/
|   |   |-- haryanamap.png
|   |   |-- image1.png
|   |   |-- image2.jpeg
|   |   `-- image3.jpg
|   `-- videos/
|       |-- gis-video.mp4
|       `-- har.mp4
`-- src/
    |-- App.css
    |-- App.jsx
    |-- index.css
    |-- logo.svg
    |-- main.jsx
    |-- msme-webgis.css
    |-- admin/
    |   |-- Admin.css
    |   |-- Admin.jsx
    |   |-- Dashboard.css
    |   |-- Dashboard.jsx
    |   |-- IndustrialZone.css
    |   |-- IndustrialZone.jsx
    |   |-- InfrastructureData.css
    |   |-- InfrastructureData.jsx
    |   |-- Location.css
    |   |-- Location.jsx
    |   |-- Report.css
    |   |-- Report.jsx
    |   |-- Setting.css
    |   |-- Setting.jsx
    |   |-- Sidebar.css
    |   |-- Sidebar.jsx
    |   |-- User.css
    |   `-- User.jsx
    |-- api/
    |   `-- axios.js
    |-- assets/
    |   |-- hero.png
    |   |-- react.svg
    |   |-- vite.svg
    |   `-- images/
    |       |-- govtlogo.png
    |       |-- hepc-logo.png
    |       |-- map-bg.png
    |       `-- security.png
    |-- components/
    |   |-- BufferButton.jsx
    |   |-- CommunitySummaryPanel.jsx
    |   |-- Features.js
    |   |-- GisToolsLayerPanel.css
    |   |-- Haryana_map.jsx
    |   |-- Header.css
    |   |-- Header.jsx
    |   |-- Header_gis.jsx
    |   |-- Header_gis_nm.css
    |   |-- Hero.js
    |   |-- InfoCards.jsx
    |   |-- LandLocationReport.jsx
    |   |-- Location.jsx
    |   |-- LocationButton.jsx
    |   |-- MapSection.js
    |   |-- Navbar.js
    |   |-- PrintScreenButton.jsx
    |   |-- Register.js
    |   |-- ResultsFlyout.jsx
    |   |-- SearchPanel.js
    |   |-- Sidebar.jsx
    |   |-- msme_project.code-workspace
    |   `-- auth/
    |       `-- AuthLayout.jsx
    |-- config/
    |   `-- layers.js
    |-- css/
    |   |-- CommunitySummaryPanel.css
    |   `-- Sidebar.css
    |-- gis/
    |   |-- msmeWebGis.js
    |   `-- msme/
    |       |-- adminExtentZoom.js
    |       |-- adminGeometryQuery.js
    |       |-- aoiRoutePanel.js
    |       |-- aoiTabVisibility.js
    |       |-- aoiVillageBufferHelpers.js
    |       |-- cadNearRadius.js
    |       |-- communityAttributeHelpers.js
    |       |-- communityLayerSpecs.js
    |       |-- communityZoomHelpers.js
    |       |-- constituencyRows.js
    |       |-- distanceLabel.js
    |       |-- distanceUiHelpers.js
    |       |-- domBind.js
    |       |-- esriGeometryJsonNormalize.js
    |       |-- fixGeometrySR.js
    |       |-- gateway502.js
    |       |-- geometryUtils.js
    |       |-- hsvpHelpers.js
    |       |-- identifyFeatureHelpers.js
    |       |-- listUtils.js
    |       |-- nearbyLayers.js
    |       |-- noDataAlert.js
    |       |-- pdfHelpers.js
    |       |-- queryClient.js
    |       |-- reportDomContext.js
    |       |-- reportSnapshots.js
    |       |-- routingHelpers.js
    |       |-- runtimeLoader.js
    |       |-- selectOptionText.js
    |       |-- serviceUrlsAndLayers.js
    |       |-- spatialRefs.js
    |       |-- uiLabels.js
    |       `-- runtimeChunks/
    |           |-- chunk01.js
    |           |-- chunk02.js
    |           `-- chunk03.js
    |-- i18n/
    |   |-- I18nContext.js
    |   |-- I18nProvider.jsx
    |   |-- strings.js
    |   `-- useI18n.js
    |-- newadmin/
    |   |-- NewAdmin.css
    |   |-- NewAdmin.jsx
    |   `-- newAdminData.js
    |-- pages/
    |   |-- AboutPage.css
    |   |-- AboutPage.jsx
    |   |-- ContactPage.css
    |   |-- ContactPage.jsx
    |   |-- Dashboard.css
    |   |-- Dashboard.jsx
    |   |-- HaryanaDemoMap.css
    |   |-- HaryanaDemoMap.jsx
    |   |-- Homepage.css
    |   |-- Homepage.jsx
    |   |-- Login.css
    |   |-- Login.jsx
    |   |-- LoginPage.css
    |   |-- LoginPage.jsx
    |   |-- MSMEGisPageShell.css
    |   |-- MSMEMapPage.jsx
    |   |-- NewAdminPage.jsx
    |   |-- NewHomepage.css
    |   |-- NewHomepage.jsx
    |   |-- newLoginPage.jsx
    |   |-- NewMainMap.css
    |   |-- NewMainMap.jsx
    |   |-- NewSignup.jsx
    |   |-- Signup.css
    |   |-- Signup.jsx
    |   |-- complete msme.code-workspace
    |   `-- newmainmap/
    |       |-- AnalysisPanel.jsx
    |       |-- BufferPanel.jsx
    |       |-- config.js
    |       |-- LayersPanel.jsx
    |       |-- MainSidebar.jsx
    |       |-- mapDecorConfig.js
    |       |-- MapDecorLayer.jsx
    |       |-- MapStage.jsx
    |       |-- NearbyPlacesPanel.jsx
    |       |-- NewMainMapHeader.css
    |       |-- NewMainMapHeader.jsx
    |       `-- SelectLandPanel.jsx
    |-- routes/
    |   `-- ProtectedRoute.jsx
    |-- services/
    |   |-- api.js
    |   `-- authService.js
    `-- styles/
        `-- msme-gis/
            |-- 01-tokens.css
            |-- 02-header.css
            |-- 03-layout-panels.css
            |-- 04-spatial-toolbar.css
            |-- 05-aoi-and-tools.css
            |-- 06-results-flyout.css
            |-- 07-map-overlays.css
            |-- 08-dark-theme.css
            `-- 09-responsive.css
```

## 7) File/Folder Purpose Guide

### Root config files

- `package.json`: dependency list + scripts (`dev`, `build`, `preview`).
- `vite.config.js`: Vite config + ArcGIS optimizeDeps settings + `/arcgis` proxy.
- `.env`: local environment variables.
- `index.html`: Vite entry HTML mounting `src/main.jsx`.
- `eslint.config.js`, `postcss.config.js`, `tailwind.config.js`: lint + styling tool config.

### `public/`

- Static media, logos, videos, and geojson files served directly by Vite.
- `public/data/*.geojson` used by demo/Leaflet map flows.

### `src/main.jsx`

- React bootstrap + strict mode render.
- Wraps app with `I18nProvider`.
- Imports ArcGIS CSS globally.

### `src/App.jsx`

- Route map for full app.
- Includes GIS page (`/msme-gis-map`), demo map, admin, auth pages.

### `src/pages/`

- Page-level route components.
- `MSMEMapPage.jsx`: main ArcGIS GIS page shell.
- `HaryanaDemoMap.jsx`: Leaflet demo map with layer toggles and controls.
- `NewMainMap.jsx` + `newmainmap/*`: alternate modular map UX.
- Other files: homepage, login/signup, about/contact, dashboards.

### `src/components/`

- Reusable UI units (header, sidebar, panels, buttons).
- `Haryana_map.jsx` provides GIS DOM mount nodes (`#viewDiv`, legend, loading overlay, utility buttons).
- `ResultsFlyout.jsx`, `LandLocationReport.jsx`, `CommunitySummaryPanel.jsx` connect with GIS outputs.

### `src/gis/msmeWebGis.js`

- Thin entry adapter exporting GIS init methods from runtime loader.

### `src/gis/msme/` (Core GIS engine modules)

- `runtimeLoader.js`: imports ArcGIS deps + helper modules + runtime chunks and exposes `initMsmeWebGis`.
- `runtimeChunks/chunk01.js..chunk03.js`: large legacy GIS runtime split chunks.
- `serviceUrlsAndLayers.js`: all ArcGIS service URLs, sublayer IDs, layer constants.
- `queryClient.js`: ArcGIS REST query/request wrappers.
- `geometryUtils.js`: geometry parsing, SR normalization, distance helpers.
- `routingHelpers.js`: route helper logic (graph helpers, validation, route symbols).
- `identifyFeatureHelpers.js`: identify-result filtering, dedupe, popup html helpers.
- `adminGeometryQuery.js`, `adminExtentZoom.js`: admin boundary geometry query and zoom behavior.
- `nearbyLayers.js`: nearby layer merge/normalization helpers.
- `gateway502.js`: network/service 502 detection.
- `noDataAlert.js`: standardized no-data feedback.
- `aoiVillageBufferHelpers.js`, `aoiTabVisibility.js`, `aoiRoutePanel.js`: AOI UI state and panel helpers.
- `cadNearRadius.js`: cadastral nearby radius read/normalize helper.
- `communityLayerSpecs.js`, `communityAttributeHelpers.js`, `communityZoomHelpers.js`: community/POI definitions, attributes, zoom handling.
- `constituencyRows.js`: constituency table row shaping.
- `distanceLabel.js`, `distanceUiHelpers.js`: distance formatting and UI distance parsing/writing.
- `domBind.js`: safe DOM element binding helpers.
- `esriGeometryJsonNormalize.js`, `fixGeometrySR.js`: geometry JSON cleanup/SR correction.
- `hsvpHelpers.js`: HSVP/industrial plot attribute normalization helpers.
- `listUtils.js`: list/chunk utility helpers.
- `pdfHelpers.js`: PDF line/date formatting helpers.
- `reportDomContext.js`, `reportSnapshots.js`: reporting state snapshots + DOM context extraction.
- `selectOptionText.js`: select value -> text helper.
- `spatialRefs.js`: shared spatial reference constants.
- `uiLabels.js`: GIS placeholders/localized label hooks.

### `src/services/` and `src/api/`

- `services/authService.js`: OTP-related HTTP API calls.
- `services/api.js`: sample user CRUD API wrapper.
- `api/axios.js`: shared axios instance for auth pages.

### `src/i18n/`

- `strings.js`: translation dictionary.
- `I18nContext.js` + `I18nProvider.jsx`: language state/provider.
- `useI18n.js`: hook for translated text usage.

### `src/admin/` and `src/newadmin/`

- Admin dashboards/forms and corresponding CSS.
- `newadmin/NewAdmin.jsx` hosts updated admin route shell.

### `src/styles/msme-gis/`

- GIS-specific layered CSS split by concern:
  - tokens, header, panel layout, toolbar, AOI/tools, results, overlays, dark theme, responsive.

## 8) End-to-End Process (How App Works)

1. User opens app route.
2. `main.jsx` renders `App` with i18n context.
3. Route `/msme-gis-map` loads `MSMEMapPage`.
4. `MSMEMapPage` calls `initMsmeWebGis()`.
5. GIS runtime creates ArcGIS `MapView` inside `#viewDiv`.
6. User actions (AOI select, map click, buffer/proximity/routing) trigger helper modules in `src/gis/msme/*`.
7. ArcGIS REST services return geometry/features.
8. Results are transformed to UI/report snapshots and shown in flyouts/panels.
9. Optional auth/API pages call backend endpoints using axios wrappers.

## 9) Local Development Workflow

1. Start backend services (if using auth/users APIs):
   - OTP service on `:8080`
   - users/auth service on `:5000` (as per code paths)
2. Fill `.env` variables.
3. Run `npm install` then `npm run dev`.
4. Verify routes:
   - `/` (homepage)
   - `/msme-gis-map` (ArcGIS page)
   - `/demo-map` (Leaflet demo)
5. For production test: `npm run build` then `npm run preview`.

## 10) Troubleshooting

- GIS page blank/loading stuck:
  - check browser console for ArcGIS/auth/CORS errors.
  - verify network access to `hsacggm.in` services.
  - set `VITE_ARCGIS_API_KEY` if route/geocode fails.
- OTP/auth fails:
  - ensure backend is running on expected host/port.
  - update `VITE_SERVER_URL` if backend URL differs.
- Proxy issues:
  - verify `vite.config.js` `/arcgis` proxy target.

## 11) Recommended Backend Structure (If You Maintain Backend Separately)

Backend is not inside this repo. A clean companion backend can look like:

```text
msme_backend/
|-- src/
|   |-- app.js
|   |-- server.js
|   |-- config/
|   |-- routes/
|   |   |-- auth.routes.js
|   |   |-- otp.routes.js
|   |   `-- users.routes.js
|   |-- controllers/
|   |-- services/
|   |-- models/
|   `-- middlewares/
|-- .env
|-- package.json
`-- README.md
```

Expected minimum API contracts from frontend:

- `POST /otp/send-otp`
- `POST /otp/verify-otp`
- `POST /api/auth/register`
- `GET/POST /api/users` and `GET /api/users/:id`

---

If you want, I can also generate a **separate BACKEND_README.md** with exact Node/Express boilerplate for these endpoints.
