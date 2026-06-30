import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
export async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.RESEND_API_KEY) { await prisma.emailLog.create({ data: { toEmail: to, subject, status: "SKIPPED", errorMessage: "RESEND_API_KEY is not configured." } }); return { ok: false, skipped: true }; }
  try { const resend = new Resend(process.env.RESEND_API_KEY); await resend.emails.send({ from: process.env.EMAIL_FROM || "Massage Studio <onboarding@resend.dev>", to, subject, text }); await prisma.emailLog.create({ data: { toEmail: to, subject, status: "SENT" } }); return { ok: true }; }
  catch (error) { await prisma.emailLog.create({ data: { toEmail: to, subject, status: "FAILED", errorMessage: error instanceof Error ? error.message : "Email failed" } }); return { ok: false }; }
}
