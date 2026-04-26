
"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  isDanger?: boolean;
  showCancel?: boolean;
}
export default function ConfirmationModal({
isOpen, onClose, onConfirm, title, message, confirmText, isDanger = false, showCancel = true}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  // ป้องกัน Hydration Error ของ Next.js
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative max-w-[360px] w-full bg-card border border-white/5 rounded-[2rem] p-10 shadow-2xl">
        <div className="text-center">
          <h2 className="text-lg font-serif uppercase tracking-[0.3em] text-text-main mb-4">{title}</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-sub leading-loose mb-10 opacity-70">
            {message}
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                onConfirm(); // Perform action
                onClose();   // Close modal
              }}
              className={`w-full py-4 text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all ${
                isDanger ? "bg-red-600 text-white" : "bg-accent text-white"
              }`}
            >
              {confirmText}
            </button>
            
            {showCancel && (
              <button onClick={onClose} className="text-[9px] uppercase tracking-[0.3em] text-text-sub/40 hover:text-text-main transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}