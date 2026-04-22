"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  id: string;
  message: string;
  type: "error" | "success" | "info";
  onClose: (id: string) => void;
};

export function Toast({ id, message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor =
    type === "error"
      ? "bg-red-500"
      : type === "success"
        ? "bg-green-500"
        : "bg-blue-500";

  return (
    <div
      className={`${bgColor} mb-2 rounded px-4 py-2 text-sm font-medium text-white shadow-md animate-in fade-in slide-in-from-top`}
      role="alert"
    >
      {message}
    </div>
  );
}
