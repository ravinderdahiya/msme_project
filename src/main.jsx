import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Ensure root element exists before rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check your index.html file.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);