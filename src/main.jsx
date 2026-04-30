import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ add this import
import { I18nProvider } from "./i18n/I18nProvider.jsx";

// ✅ ArcGIS CSS (important)
import "@arcgis/core/assets/esri/themes/light/main.css";

// Ensure root element exists before rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check your index.html file.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);