import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.js";

// render react starting from DOM component "root"
const container = document.getElementById("root");

const root = ReactDOM.createRoot(container);
root.render(<App />);
