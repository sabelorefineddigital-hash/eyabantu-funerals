import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { StaffAccessLevel, UserRole } from "@prisma/client";

const COOKIE = "ntf_session";

function secretKey() {
  const s =
    process.env.AUTH_SECRET ?? "ntf-demo-secret-change-in-production-min-32-chars!!";
  return new TextEncoder().encode(s);
}

export type SessionPayload = {
  sub: string;
  tenantId: string;
  role: UserRole;
  staffAccess: StaffAccessLevel;
  email: string;
};

export async function signSession(payload: SessionPayload, maxAgeSec = 60 * 60 * 24 * 7) {
  return await new SignJWT({
    tenantId: payload.tenantId,
    role: payload.role,
    staffAccess: payload.staffAccess,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sub = payload.sub;
    if (!sub) return null;
    return {
      sub,
      tenantId: String(payload.tenantId ?? ""),
      role: payload.role as UserRole,
      staffAccess: (payload.staffAccess as StaffAccessLevel) ?? "NONE",
      email: String(payload.email ?? ""),
    };
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export { COOKIE };
