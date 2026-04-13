"use client";

import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

const alertStyles = {
  success:
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100",
  error:
    "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100",
  warning:
    "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-100",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-100",
};

const iconMap = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

export function Alert({
  type = "info",
  title,
  message,
  onClose,
  dismissible = true,
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 ${alertStyles[type]}`}
    >
      <div className="flex-shrink-0">{iconMap[type]}</div>
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-lg leading-none hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}
