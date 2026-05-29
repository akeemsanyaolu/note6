"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { GoogleLogo } from "@/components/google-logo";
import { signIn } from "@/lib/auth/auth.client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  async function handleEmailSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("rememberMe") === "on";

    setError(null);
    setIsSubmitting(true);

    const result = await signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: "/",
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to sign in.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsGoogleSubmitting(true);

    const result = await signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    setIsGoogleSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to continue with Google.");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleEmailSignIn}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          required
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            name="rememberMe"
            type="checkbox"
            className="size-4 border border-white/25 bg-black accent-white"
          />
          Remember
        </label>
      </div>

      {error ? (
        <p className="border border-red-400/40 bg-red-950/30 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      <Button className="w-full" disabled={isSubmitting || isGoogleSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Sign in
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/15" />
        <span className="text-xs text-zinc-500">
          Or
        </span>
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <Button
        className="w-full"
        disabled={isSubmitting || isGoogleSubmitting}
        onClick={handleGoogleSignIn}
        type="button"
        variant="secondary"
      >
        {isGoogleSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GoogleLogo />
        )}
        Continue with Google
      </Button>
    </form>
  );
}
