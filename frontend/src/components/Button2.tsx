import { type ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

export function Button2({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "flex cursor-pointer items-center justify-center gap-3 rounded-full px-8 py-3 font-medium transition-colors disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-residential-60 border border-residential-30 text-white/primary hover:bg-residential-50 active:bg-residential-40 disabled:bg-residential-80 disabled:text-white/tertiary disabled:border-transparent",
    secondary:
      "border border-residential-30 text-white/secondary hover:bg-residential-80 hover:text-white/primary active:bg-residential-70 disabled:opacity-30",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props} />
  );
}