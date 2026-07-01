import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { getSessionFromCookies, type SessionPayload } from "@/lib/session";

export function postLoginPath(role: UserRole, nextRaw: FormDataEntryValue | null): string {
  const fallback = role === "OWNER" ? "/owner" : "/staff";
  if (typeof nextRaw !== "string") return fallback;
  const next = nextRaw.trim();
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (role === "OWNER") return next.startsWith("/owner") ? next : fallback;
  return next.startsWith("/staff") ? next : fallback;
}

/** Use on `/owner/*` pages — redirects if unauthenticated or not an owner. */
export async function requireOwnerSession(): Promise<SessionPayload> {
  const s = await getSessionFromCookies();
  if (!s) redirect("/login");
  if (s.role !== "OWNER") redirect("/staff");
  return s;
}

/** Use on `/staff/*` pages — redirects if unauthenticated or not staff. */
export async function requireStaffSession(): Promise<SessionPayload> {
  const s = await getSessionFromCookies();
  if (!s) redirect("/login");
  if (s.role !== "STAFF") redirect(s.role === "OWNER" ? "/owner" : "/login");
  return s;
}
