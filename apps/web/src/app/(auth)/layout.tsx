import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/utils";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full px-4 py-8">{children}</main>
    </div>
  );
}
