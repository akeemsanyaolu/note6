"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOut } from "@/lib/auth/auth.client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    router.push("/signin");
    router.refresh();
  }

  return (
    <Button
      disabled={isSigningOut}
      onClick={handleSignOut}
      type="button"
      variant="secondary"
    >
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}
