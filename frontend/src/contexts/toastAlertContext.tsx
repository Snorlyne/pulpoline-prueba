import { createContext } from "react";
import type { ToastAlertType } from "../types/toastAlert.type";


interface ToastAlertContextProps {
  showToastAlert: (message: string, type?: ToastAlertType) => void;
}

export const ToastAlertContext = createContext<ToastAlertContextProps | undefined>(
  undefined
);
