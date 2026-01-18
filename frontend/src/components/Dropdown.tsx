import { type ReactNode, type ComponentProps } from "react";

// THE CONTAINER
export function Dropdown({
  children,
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={`
        min-w-45 overflow-hidden rounded-lg 
        border border-gray-300 dark:border-residential-30 
        bg-white dark:bg-residential-80
        flex flex-col
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// THE ITEM INSIDE THE DROPDOWN
interface DropdownItemProps extends ComponentProps<"button"> {
  icon?: ReactNode;
  isDestructive?: boolean;
}

export function DropdownItem({ icon, children, isDestructive, className = "", ...props }: DropdownItemProps) {
  return (
    <button
      className={`
        group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors cursor-pointer
        hover:bg-gray-100 dark:hover:bg-residential-60 
        active:bg-gray-200 dark:active:bg-residential-50
        ${isDestructive ? "text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300" : "text-black dark:text-white"}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <span className={`
          flex w-5 items-center justify-center 
          ${isDestructive ? "text-red-500 dark:text-red-400" : "text-black/50 dark:text-white/secondary group-hover:text-black dark:group-hover:text-white"}
        `}>
          {icon}
        </span>
      )}
      
      {/* Label */}
      <span className="type-body font-normal">
        {children}
      </span>
    </button>
  );
}