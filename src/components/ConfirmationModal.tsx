import { X } from "lucide-react";
import React from "react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Sim, alterar",
  cancelText = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#1e1e1e] rounded-lg w-[350px] max-w-md shadow-lg overflow-hidden border border-[#333333]">
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                <span className="text-white text-xs">i</span>
              </div>
              <h3 className="text-base text-white">{title}</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
          <div className="text-white text-sm mb-4 pl-7">
            {message}
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={onClose}
              className="px-6 py-1.5 bg-[#333333] text-white rounded hover:bg-[#444444] transition-colors text-sm"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-6 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
