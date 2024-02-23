import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./ddm/theme.colors";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.onfocus = () => document.documentElement.classList.add("focused");
window.onblur = () => document.documentElement.classList.remove("focused");
