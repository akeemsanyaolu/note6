import type { ReactNode } from "react";

import { Logo } from "@/components/logo";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="border-b border-white/15 bg-black">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Logo className="size-9" variant="light" />
          <div>
            <p className="text-sm font-semibold leading-4 text-white">
              note6
            </p>
            <p className="text-xs text-zinc-500">Notes</p>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
