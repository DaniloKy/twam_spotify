import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

type ToastPopupProps = {
  message: string;
  onClose: () => void;
  success?: boolean;
  duration?: number;
};

const ToastPopup = ({
  message,
  onClose,
  success = false,
  duration = 3333,
}: ToastPopupProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!fadeOut) {
      const timer = setTimeout(() => setFadeOut(true), duration - 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onClose, 300);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, duration, onClose]);

  return (
    <div
      className={`fixed left-0 w-full z-50 flex items-start justify-center p-4 ${
        fadeOut ? "animate-fade-out" : "animate-fade-in"
      }`}
      style={{ top: "15%" }}
    >
      <div
        className={`bg-[#1e1e1e] border-2 px-14 py-12 rounded-xl max-w-md w-full relative shadow-lg ${
          success ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:opacity-70"
        >
          <X size={16} />
        </button>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ToastPopup;
