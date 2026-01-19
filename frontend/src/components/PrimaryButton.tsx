import { type ReactNode, type ComponentProps } from "react";

interface PrimaryButtonProps extends ComponentProps<"button"> {
  icon?: ReactNode;
  img?: string;
}

export function PrimaryButton({
  icon,
  img,
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button 
      className={`cursor-pointer flex h-10 items-center justify-center gap-2 rounded-lg pl-3 pr-4 font-medium antialiased transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50
        bg-gray-200 dark:bg-bg-residential-60
        text-black dark:text-white 
        hover:bg-gray-300 dark:hover:bg-bg-residential-50 
        active:bg-gray-400 dark:active:bg-residential-40
        ${className}`} 
      {...props}
    >
      {(icon || img) && (
        <span className="flex items-center justify-center h-5 w-5">
            {/* img or icon depending on prop */}
          {img ? (
            <img
              src={img}
              alt=""
              className="h-full w-full object-contain pointer-events-none"
            />
          ) : (
            icon
          )}
        </span>
      )}

      {/* Text Label */}
      <span className="text-sm tracking-wide">{children}</span>
    </button>
  );
}
