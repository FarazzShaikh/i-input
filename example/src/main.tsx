import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { DemoApp } from "./DemoApp";

// Open `/?demo` to show the square social-media demo page.
const isDemo = new URLSearchParams(window.location.search).has("demo");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{isDemo ? <DemoApp /> : <App />}</React.StrictMode>,
);
