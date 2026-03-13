import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { useAppStore } from "./store/useAppStore";
import "./index.css";

const syncTheme = (darkMode: boolean) => {
  document.documentElement.classList.toggle("dark", darkMode);
};

syncTheme(useAppStore.getState().darkMode);
useAppStore.subscribe((state) => syncTheme(state.darkMode));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
