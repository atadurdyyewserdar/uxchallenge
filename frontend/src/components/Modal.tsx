import { type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, title, children }: ModalProps) {
  // don't render the modal when it's closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-all p-4">
      {/* modal container*/}
      <div className="text-black dark:text-white bg-white dark:bg-residential-80 w-auto max-w-lg rounded-2xl border border-residential-30 p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* header/title */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h2 className="type-h2 text-xl sm:text-3xl text-white/primary">{title}</h2>
        </div>
        <div className="space-y-4">{children}</div>

      </div>
    </div>
  );
}
