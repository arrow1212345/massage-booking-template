import { AppointmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatMoney } from "@/lib/format";
import { sendEmail } from "@/lib/email";
import { createCalendarEvent } from "@/lib/calendar";

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: "待確認",
  CONFIRMED: "已確認",
  CANCELLED: "已取消",
  RESCHEDULE_REQUIRED: "需改期",
  COMPLETED: "已完成",
};

async function updateStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as AppointmentStatus;
  const appointment = await prisma.appointment.update({ where: { id }, data: { status }, include: { service: true } });
  if (status === "CONFIRMED") {
    const eventId = await createCalendarEvent(`${appointment.service.name} - ${appointment.clientName}`, appointment.startsAt, appointment.endsAt);
    await prisma.appointment.update({ where: { id }, data: { googleCalendarEventId: eventId } });
    await sendEmail(appointment.clientEmail, "預約已確認", `你的預約 ${appointment.bookingNumber} 已確認，時間：${formatDateTime(appointment.startsAt)}。`);
  }
  if (status === "CANCELLED") await sendEmail(appointment.clientEmail, "預約已取消", `你的預約 ${appointment.bookingNumber} 已取消。`);
  revalidatePath("/admin/appointments");
}

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({ include: { service: true, location: true }, orderBy: { startsAt: "desc" }, take: 100 });
  return (
    <>
      <h1>預約管理</h1>
      <table>
        <thead><tr><th>編號</th><th>客戶</th><th>服務</th><th>時間</th><th>狀態</th><th>操作</th></tr></thead>
        <tbody>{appointments.map((a) => <tr key={a.id}><td>{a.bookingNumber}</td><td>{a.clientName}<br />{a.clientEmail}</td><td>{a.service.name}<br />{a.location.name}<br />{formatMoney(a.priceCents)}</td><td>{formatDateTime(a.startsAt)}</td><td>{statusLabels[a.status]}</td><td><form action={updateStatus} className="form"><input type="hidden" name="id" value={a.id} /><select name="status" defaultValue={a.status}>{Object.values(AppointmentStatus).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select><button>更新</button></form></td></tr>)}</tbody>
      </table>
    </>
  );
}
