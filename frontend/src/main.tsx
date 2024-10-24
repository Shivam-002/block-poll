import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { MetaMaskProvider } from "./context/MetaMaskContext";
import { PollingContractProvider } from "./context/PollingContractContext";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <MetaMaskProvider>
      <PollingContractProvider>
        <App />
      </PollingContractProvider>
    </MetaMaskProvider>
  </React.StrictMode>
);
