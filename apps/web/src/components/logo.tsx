import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

type LogoProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  variant?: "light" | "dark";
};

export function Logo({ className, variant = "light", ...props }: LogoProps) {
  return (
    <Image
      alt="note6"
      className={cn("block size-10", className)}
      height={48}
      src={variant === "light" ? "/logo-light.svg" : "/logo-dark.svg"}
      width={47}
      {...props}
    />
  );
}
