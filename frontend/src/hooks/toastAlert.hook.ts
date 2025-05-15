import { useContext } from "react";
import { ToastAlertContext } from "../contexts/toastAlertContext";


export const useToastAlert = () => {
  const context = useContext(ToastAlertContext);
  if (!context) {
    throw new Error("useToastAlert must be used within a ToastAlertProvider");
  }
  return context;
};
