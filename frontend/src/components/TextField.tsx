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
          className={`h-[40px] w-full rounded-lg px-3 py-2 outline-none transition-colors duration-200
            bg-gray-100 dark:bg-[#1E1E1E] 
            border border-gray-300 dark:border-[#282828]
            text-black dark:text-white 
            placeholder-black/30 dark:placeholder-white/30
            hover:border-gray-400 dark:hover:border-[#373737]
            focus:bg-white dark:focus:bg-[#282828] 
            focus:border-gray-500 dark:focus:border-[#414141]
            ${className}`}
          {...props}
        />
        {error && <p className="p-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
