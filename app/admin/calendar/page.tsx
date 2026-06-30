import Link from "next/link";
import { getGoogleAuthUrl, isGoogleConfigured } from "@/lib/calendar";
import { prisma } from "@/lib/prisma";

export default async function AdminCalendarPage() {
  const connections = await prisma.calendarConnection.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  const authUrl = getGoogleAuthUrl();
  return (
    <>
      <h1>Google Calendar</h1>
      {!isGoogleConfigured() ? <div className="notice">尚未設定 Google OAuth 環境變數。</div> : <Link className="button" href={authUrl || "#"}>連接 Google Calendar</Link>}
      <div className="grid" style={{ marginTop: 24 }}>{connections.map((c) => <div className="card" key={c.id}><h2>{c.googleAccountEmail}</h2><p>日曆：{c.calendarId}</p></div>)}</div>
    </>
  );
}
