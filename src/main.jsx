/**
 * Main entry point for the React application.
 * Renders the App component inside the root DOM element.
 * Imports global styles and Bootstrap dependencies.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/main.scss";
import { LoadingProvider } from "./context/LoadingContext"; // import the provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </React.StrictMode>
);
