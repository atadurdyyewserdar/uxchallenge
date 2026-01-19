import { type ReactNode, type ComponentProps } from "react";

interface SecondaryButtonProps extends ComponentProps<"button"> {
  icon?: ReactNode;
}

export function SecondaryButton({ icon, children, className = "", ...props }: SecondaryButtonProps) {
  return (
    <button 
      className={`cursor-pointer flex h-10 items-center justify-center gap-2 rounded-lg pl-3 pr-4 font-medium antialiased transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50
        bg-transparent 
        border border-gray-300 dark:border-residential-30
        text-black dark:text-white 
        hover:bg-gray-100 dark:hover:bg-residential-90
        active:bg-gray-200 dark:active:bg-residential-70
        ${className}`} 
      {...props}
    >
      {/* Icon */}
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      
      {/* Text Label */}
      <span className="text-sm tracking-wide">{children}</span>
    </button>
  );
}