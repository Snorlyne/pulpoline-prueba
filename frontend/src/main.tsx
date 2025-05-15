import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./providers/auth.provider.tsx";
import { ToastAlertProvider } from "./providers/toastAlertProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      
      <ToastAlertProvider>
        <App />
      </ToastAlertProvider>
    </AuthProvider>
  </StrictMode>
);
