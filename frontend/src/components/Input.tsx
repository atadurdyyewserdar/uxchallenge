
import { type ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-sm font-medium text-white/secondary ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full rounded-lg border border-residential-30 bg-residential-100 px-4 py-3 
            text-white/primary placeholder-white/tertiary outline-none transition-colors
            focus:border-residential-60 focus:bg-residential-90
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
}