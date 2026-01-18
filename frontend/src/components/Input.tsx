// Input.tsx
import { type ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {/* Label: Secondary Opacity (56%) */}
      {label && (
        <label className="text-sm font-medium text-white/secondary ml-1">
          {label}
        </label>
      )}
      
      {/* Input Field:
        - bg-residential-100: It goes "down" to the darkest shade to stand out on the modal.
        - border-residential-30: Subtle border definition.
        - text-white/primary: Text inside is bright.
        - focus: Highlights the border to Level 60 (Button color) or 10 (Highlight).
      */}
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