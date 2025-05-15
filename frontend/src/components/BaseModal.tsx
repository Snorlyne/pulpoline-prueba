import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface BaseModalProps {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
  backdropClassName?: string;
  containerClassName?: string;
}

export default function BaseModal({
  open,
  children,
  onClose,
  backdropClassName = "bg-black/30",
  containerClassName = "flex justify-center items-center w-full h-full overflow-x-hidden overflow-y-auto",
}: BaseModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`z-20 absolute inset-0 flex justify-center items-center ${backdropClassName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={containerClassName}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // evita que el click cierre si haces clic dentro del modal
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
