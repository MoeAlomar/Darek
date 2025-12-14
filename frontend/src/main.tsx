import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  // We wrap the entire App in BrowserRouter to enable routing
  <BrowserRouter>
    <App />
  </BrowserRouter>
);