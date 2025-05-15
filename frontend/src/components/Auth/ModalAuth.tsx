import { useState } from "react";
import BaseModal from "../BaseModal";
import AuthForm from "./AuthForm"; // Usa el nuevo formulario unificado

interface ModalAuthProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalAuth({ open, onClose }: ModalAuthProps) {
  const [currentForm, setCurrentForm] = useState<"login" | "register">("login");

  const handleClose = () => {
    onClose();
    setCurrentForm("login"); // Reset a login al cerrar
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      containerClassName="flex flex-col bg-gray-50 dark:bg-gray-800 shadow-lg max-md:mx-2 px-4 max-sm:px-2 py-4 rounded-md w-full md:max-w-xl"
    >
      <div>
        <div className="flex justify-between items-center gap-3 pb-4 border-gray-200 dark:border-gray-700 border-b">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {currentForm === "login" ? "Login" : "Register"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Complete the form to {currentForm === "login" ? "login" : "register"} and
              start marking your{" "}
              <span className="font-semibold text-amber-500">favorite</span> cities
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-start focus:outline-none h-full cursor-pointer"
          >
            <svg
              className="w-[24px] h-[24px] text-gray-500 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </button>
        </div>
        <AuthForm
          mode={currentForm}
          changeForm={() =>
            setCurrentForm(currentForm === "login" ? "register" : "login")
          }
          onLoggedIn={handleClose}
        />
      </div>
    </BaseModal>
  );
}
