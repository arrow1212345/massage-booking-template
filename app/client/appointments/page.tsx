import { redirect } from "next/navigation";
import { getClientEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

export default async function ClientAppointmentsPage() {
  const email = await getClientEmail();
  if (!email) redirect("/client/login");
  const appointments = await prisma.appointment.findMany({ where: { clientEmail: email }, include: { service: true, location: true }, orderBy: { startsAt: "desc" } });
  return (
    <main className="container" style={{ padding: "56px 0" }}>
      <h1>我的預約</h1>
      <div className="grid">{appointments.map((a) => <div className="card" key={a.id}><h2>{a.service.name}</h2><p>{a.bookingNumber} · {a.status}</p><p>{formatDateTime(a.startsAt)}</p><p>{a.location.name}</p></div>)}</div>
    </main>
  );
}
