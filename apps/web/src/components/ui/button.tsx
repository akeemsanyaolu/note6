import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  asChild,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 border px-4 text-sm font-medium outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        variant === "primary" &&
          "border-white bg-white text-black hover:bg-zinc-200",
        variant === "secondary" &&
          "border-white/25 bg-black text-white hover:border-white/50 hover:bg-white/10",
        variant === "ghost" &&
          "border-transparent bg-transparent text-zinc-300 hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
