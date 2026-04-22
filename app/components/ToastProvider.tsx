"use client";

import { createContext, useContext, useState } from "react";

type ToastMessage = {
  id: string;
  message: string;
  type: "error" | "success" | "info";
};

type ToastContextType = {
  toasts: ToastMessage[];
  addToast: (message: string, type?: "error" | "success" | "info") => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function addToast(message: string, type: "error" | "success" | "info" = "info") {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
