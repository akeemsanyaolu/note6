import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/utils";
import { Header } from "@/components/header";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header>
        <SignOutButton />
      </Header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
