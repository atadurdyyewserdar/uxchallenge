import { type ReactNode, type ComponentProps, useState } from "react";

type ButtonVariant = "primary" | "secondary" | "special";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  icon?: ReactNode; 
  img?: string;     
}

export function Button({ variant = "primary", icon, img, children, className = "", style, ...props }: ButtonProps) {
  // track hover and click states for animations
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const base = "flex cursor-pointer items-center justify-center gap-2.5 rounded-full font-medium antialiased disabled:cursor-not-allowed disabled:opacity-50";
  // auto-adjust padding if it's just an icon or has text + icon
  const sizeStyles = children ? "px-6 py-3 text-base" : "p-3";

  // Standard Variants
  const standardVariants = {
    primary: "bg-residential-60 border border-residential-30 text-white/primary hover:bg-residential-50 active:bg-residential-40 transition-colors duration-200",
    secondary: "bg-transparent border border-residential-30 text-white/secondary hover:bg-residential-80 hover:text-white/primary active:bg-residential-70 transition-colors duration-200",
  };

  // Special Button Logic
  const isSpecial = variant === "special";
  
  // gradient with hover/press states using CSS layers
  const getSpecialStyle = () => {
    if (!isSpecial) return {};
    const baseLayers = `
      linear-gradient(rgba(40, 40, 40, 0.7), rgba(40, 40, 40, 0.7)) padding-box, 
      linear-gradient(to bottom, #3C3C3C, rgba(60, 60, 60, 0)) border-box
    `;
    let overlay = "";
    if (isPressed) {
      overlay = "linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08)) padding-box,"; 
    } else if (isHovered) {
      overlay = "linear-gradient(rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)) padding-box,"; 
    }
    return {
      background: `${overlay} ${baseLayers}`,
      border: "1px solid transparent",
      transition: "all 80ms ease-out",
      transform: isPressed ? "scale(0.98)" : "scale(1)",
    };
  };

  return (
    <button 
      className={`${base} ${sizeStyles} ${isSpecial ? "text-white/primary" : standardVariants[variant]} ${className}`} 
      style={getSpecialStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      {/* render icon from prop or img url */}
      {(icon || img) && (
        <span className="flex items-center justify-center h-5 w-5">
          {/* use img tag if available, otherwise component */}
          {img ? (
            <img src={img} alt="" className="h-full w-full object-contain pointer-events-none" />
          ) : (
            icon
          )}
        </span>
      )}
      
      {children}
    </button>
  );
}