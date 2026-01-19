import { type ComponentProps } from "react";

interface IconButtonProps extends ComponentProps<"button"> {
  icon: string;
  variation?: "primary" | "secondary" | "special";
  imgWidth?: number;
  imgHeight?: number;
}

// Small circular icon button used for toolbars and menus
export function IconButton({
  icon,
  variation,
  className = "",
  imgWidth,
  imgHeight,
  ...props
}: IconButtonProps) {
  // choose bg depending on variation
  let bgColors = "bg-gray-200 dark:bg-residential-60";

  if (variation === "primary") {
    bgColors = "bg-residential-40 dark:bg-residential-60";
  } else if (variation === "secondary") {
    bgColors = "bg-residential-20 dark:bg-residential-100";
  } else if (variation === "special") {
    bgColors = "bg-residential-30 dark:bg-residential-80";
  }

  return (
    <button
      className={`
        flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full 
        transition-colors cursor-pointer
        ${bgColors}
        hover:bg-gray-800 dark:hover:bg-residential-50
        ${className}
      `}
      {...props}
    >
      <img
        src={icon}
        alt=""
        className={
          imgHeight && imgWidth ? `w-${imgWidth} h-${imgHeight}` : "h-4 w-4"
        }
      />
    </button>
  );
}
