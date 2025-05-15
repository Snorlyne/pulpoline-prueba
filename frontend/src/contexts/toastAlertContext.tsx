import { createContext } from "react";
import type { ToastAlertType } from "../types/toastAlert.types";


interface ToastAlertContextProps {
  showToastAlert: (message: string, type?: ToastAlertType) => void;
}

export const ToastAlertContext = createContext<ToastAlertContextProps | undefined>(
  undefined
);
