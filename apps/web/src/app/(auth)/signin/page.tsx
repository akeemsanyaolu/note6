import Link from "next/link";

import { Logo } from "@/components/logo";
import { SignInForm } from "./components/form";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
      <section className="relative w-full overflow-hidden border border-white/15 bg-black p-6 shadow-[0_24px_80px_rgba(255,255,255,0.05)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-px border border-white/[0.03]" />

        <div className="relative mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Logo variant="light" />
            <div>
              <p className="text-sm font-semibold text-white">
                note6
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-10 text-white">
              Welcome Back
            </h1>
            <p className="text-base leading-6 text-zinc-400">
              Return to your private writing surface.
            </p>
          </div>
        </div>

        <div className="relative">
          <SignInForm />
        </div>

        <p className="relative mt-6 text-center text-sm text-zinc-400">
          No account?{" "}
          <Link className="font-medium text-white underline-offset-4 hover:underline" href="/signup">
            Create one
          </Link>
        </p>
      </section>
    </div>
  );
}
