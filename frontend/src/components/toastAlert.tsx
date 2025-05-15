import type { ToastAlertType } from "../types/toastAlert.type";

interface ToastAlertProps {
  type: ToastAlertType;
  message: string;
  onClose?: () => void;
}

const alertStyles: Record<ToastAlertType, string> = {
  info: "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400",
  danger: "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400",
  success: "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400",
  warning: "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300",
  dark: "text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
};

export default function ToastAlert({ type, message, onClose }: ToastAlertProps) {
  return (
    <div
      className={`flex items-center p-4 mb-4 text-sm rounded-lg ${alertStyles[type]}`}
      role="alert"
    >
      <svg
        className="inline me-3 w-4 h-4 shrink-0"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div> {message}</div>
      {onClose && (
        <button className="ml-auto font-semibold text-lg" onClick={onClose}>
          ✖
        </button>
      )}
    </div>
  );
}
