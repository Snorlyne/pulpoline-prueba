import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useState, useCallback } from "react";
import ToastAlert from "../components/toastAlert";
import { ToastAlertContext } from "../contexts/toastAlertContext";
import type { ToastAlertType } from "../types/toastAlert.types";
import {
  TOAST_DURATION_MILLIS,
  TOAST_IN_DURATION_MILLIS,
} from "../consts/toastDelays.constant";

export const ToastAlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<
    { id: string; message: string; type: ToastAlertType }[]
  >([]);

  const showAlert = useCallback((message: string, type: ToastAlertType = "info") => {
    const id = crypto.randomUUID();
    setAlerts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, TOAST_DURATION_MILLIS);
  }, []);

  return (
    <ToastAlertContext.Provider value={{ showToastAlert: showAlert }}>
      {children}
      <div className="top-18 right-4 z-50 absolute space-y-4 max-h-[80vh] overflow-hidden">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: TOAST_IN_DURATION_MILLIS / 1000 }}
              className="w-80"
            >
              <ToastAlert
                type={alert.type}
                message={
                  alert.message == "NEXT_REDIRECT" ? "Sesión expirada" : alert.message
                }
                onClose={() => {
                  setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastAlertContext.Provider>
  );
};
