import { redirect } from "next/navigation";
import type { AuthUser } from "@yunity/contracts";
import { AdminShell } from "@/components/admin-shell";
import { apiFetch } from "@/lib/api";

/** Geschuetzter Bereich: ohne gueltige Session geht es zum Login. */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await apiFetch<AuthUser>("/api/v1/auth/me");
  if (!user) {
    redirect("/login");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
