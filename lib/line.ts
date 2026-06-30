import { LineMessageStatus, NotificationEventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
export function isLineConfigured() { return Boolean(process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN && process.env.LINE_MESSAGING_CHANNEL_SECRET); }
export async function pushLineMessage(lineUserId: string | null | undefined, text: string, eventType: NotificationEventType) {
  if (!lineUserId) { await prisma.lineMessageLog.create({ data: { eventType, status: LineMessageStatus.SKIPPED_NO_LINE } }); return { ok: false, skipped: true }; }
  const token = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;
  if (!token) { await prisma.lineMessageLog.create({ data: { eventType, status: LineMessageStatus.SKIPPED_DISABLED, lineUserId } }); return { ok: false, skipped: true }; }
  const response = await fetch("https://api.line.me/v2/bot/message/push", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ to: lineUserId, messages: [{ type: "text", text }] }) });
  if (!response.ok) { const body = await response.text(); await prisma.lineMessageLog.create({ data: { eventType, status: LineMessageStatus.FAILED, lineUserId, errorMessage: body } }); return { ok: false }; }
  await prisma.lineMessageLog.create({ data: { eventType, status: LineMessageStatus.SENT, lineUserId } }); return { ok: true };
}
