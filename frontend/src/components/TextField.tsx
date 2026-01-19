import { forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-2 ">
        {/* Label outside the field */}
        {label && (
          <label className="text-sm font-normal tracking-wide text-black/60 dark:text-white/60 ml-1">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`h-12 sm:h-14 w-full rounded-lg px-3 py-2 outline-none transition-colors duration-200
            bg-gray-100 dark:bg-residential-60 
            border border-gray-300
            text-black dark:text-white text-base sm:text-lg
            placeholder-black/30 dark:placeholder-white/30
            hover:border-gray-400 dark:hover:bg-residential-30
            focus:bg-white dark:focus:bg-residential-60
            focus:border-gray-500 dark:focus:border-residential-10
            ${className}`}
          {...props}
        />
        {error && <p className="p-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
