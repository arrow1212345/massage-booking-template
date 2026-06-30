import crypto from "crypto";
import { cookies } from "next/headers";
const adminCookieName = "massage_template_admin";
const clientCookieName = "massage_template_client";
function secret(name: string) { return process.env[name] || process.env.ADMIN_SESSION_SECRET || "local-development-secret"; }
function sign(value: string, key: string) { return crypto.createHmac("sha256", key).update(value).digest("hex"); }
export function createSignedValue(value: string, keyName: string) { return `${value}.${sign(value, secret(keyName))}`; }
export function readSignedValue(raw: string | undefined, keyName: string) {
  if (!raw) return null;
  const [value, signature] = raw.split(".");
  if (!value || !signature) return null;
  return sign(value, secret(keyName)) === signature ? value : null;
}
export async function isAdminAuthenticated() { const store = await cookies(); return readSignedValue(store.get(adminCookieName)?.value, "ADMIN_SESSION_SECRET") === "admin"; }
export async function setAdminSession() { const store = await cookies(); store.set(adminCookieName, createSignedValue("admin", "ADMIN_SESSION_SECRET"), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 }); }
export async function setClientSession(email: string) { const store = await cookies(); store.set(clientCookieName, createSignedValue(email, "CLIENT_SESSION_SECRET"), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 }); }
export async function getClientEmail() { const store = await cookies(); return readSignedValue(store.get(clientCookieName)?.value, "CLIENT_SESSION_SECRET"); }
