import { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => (
  <button className={cn("button", `button--${variant}`, className)} {...props} />
);
