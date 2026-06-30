import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
function oauthClient() { if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return null; return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI); }
export function isGoogleConfigured() { return Boolean(oauthClient()); }
export function getGoogleAuthUrl() { const client = oauthClient(); if (!client) return null; return client.generateAuthUrl({ access_type: "offline", prompt: "consent", scope: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.email"] }); }
export async function saveGoogleCode(code: string) {
  const client = oauthClient(); if (!client) throw new Error("Google OAuth is not configured.");
  const { tokens } = await client.getToken(code); client.setCredentials(tokens);
  const oauth2 = google.oauth2({ auth: client, version: "v2" }); const me = await oauth2.userinfo.get();
  await prisma.calendarConnection.create({ data: { googleAccountEmail: me.data.email || "calendar@example.com", accessToken: tokens.access_token || "", refreshToken: tokens.refresh_token || null, expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null } });
}
async function authorizedCalendar() { const connection = await prisma.calendarConnection.findFirst({ where: { revokedAt: null }, orderBy: { createdAt: "desc" } }); if (!connection) return null; const client = oauthClient(); if (!client) return null; client.setCredentials({ access_token: connection.accessToken, refresh_token: connection.refreshToken || undefined, expiry_date: connection.expiryDate?.getTime() }); return { calendar: google.calendar({ version: "v3", auth: client }), calendarId: connection.calendarId }; }
export async function createCalendarEvent(summary: string, startsAt: Date, endsAt: Date) { const authorized = await authorizedCalendar(); if (!authorized) return null; const result = await authorized.calendar.events.insert({ calendarId: authorized.calendarId, requestBody: { summary, start: { dateTime: startsAt.toISOString() }, end: { dateTime: endsAt.toISOString() } } }); return result.data.id || null; }
