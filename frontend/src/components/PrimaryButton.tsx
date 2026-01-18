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
      className={`cursor-pointer flex h-[40px] items-center justify-center gap-2 rounded-lg pl-3 pr-4 font-medium antialiased transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50
        bg-gray-200 dark:bg-[#282828] 
        text-black dark:text-white 
        hover:bg-gray-300 dark:hover:bg-[#2D2D2D] 
        active:bg-gray-400 dark:active:bg-[#323232]
        ${className}`} 
      {...props}
    >
      {(icon || img) && (
        <span className="flex items-center justify-center h-5 w-5">
            {/* Img or Icon depending on prop */}
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
