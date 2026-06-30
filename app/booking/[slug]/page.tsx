import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { isSlotAvailable, nextBookingNumber } from "@/lib/booking";
import { sendEmail } from "@/lib/email";

async function createAppointment(formData: FormData) {
  "use server";
  const serviceId = String(formData.get("serviceId") || "");
  const locationId = String(formData.get("locationId") || "");
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const clientName = String(formData.get("clientName") || "").trim();
  const clientEmail = String(formData.get("clientEmail") || "").trim().toLowerCase();
  const clientPhone = String(formData.get("clientPhone") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const customAddress = String(formData.get("customAddress") || "").trim() || null;

  const [service, pricing] = await Promise.all([
    prisma.service.findUniqueOrThrow({ where: { id: serviceId } }),
    prisma.serviceLocationPricing.findUnique({ where: { serviceId_locationId: { serviceId, locationId } } }),
  ]);
  const startsAt = new Date(`${date}T${time}:00`);
  const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60000);

  if (!clientName || !clientEmail || !clientPhone || Number.isNaN(startsAt.getTime())) redirect(`/booking/${service.slug}?error=missing`);
  if (!(await isSlotAvailable(locationId, startsAt, endsAt))) redirect(`/booking/${service.slug}?error=busy`);

  const user = await prisma.user.upsert({
    where: { email: clientEmail },
    update: { name: clientName, phone: clientPhone },
    create: { email: clientEmail, name: clientName, phone: clientPhone },
  });
  const appointment = await prisma.appointment.create({
    data: {
      bookingNumber: await nextBookingNumber(),
      clientId: user.id,
      serviceId,
      locationId,
      clientName,
      clientEmail,
      clientPhone,
      customAddress,
      note,
      startsAt,
      endsAt,
      priceCents: pricing?.priceCents ?? service.basePriceCents,
    },
  });

  await sendEmail(clientEmail, "已收到預約申請", `你的預約申請已收到。預約編號：${appointment.bookingNumber}`);
  if (process.env.ADMIN_NOTIFICATION_EMAIL) await sendEmail(process.env.ADMIN_NOTIFICATION_EMAIL, "新的預約申請", `${clientName} 預約 ${service.name}，時間：${startsAt.toISOString()}`);
  redirect(`/booking/success?booking=${appointment.bookingNumber}`);
}

export default async function BookingPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ error?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) redirect("/services");
  const locations = await prisma.location.findMany({
    where: { isActive: true, locationPrices: { some: { serviceId: service.id, isActive: true } } },
    include: { locationPrices: { where: { serviceId: service.id } } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="container" style={{ padding: "56px 0" }}>
      <p className="eyebrow">線上預約</p>
      <h1>{service.name}</h1>
      <p>{service.description}</p>
      <p><strong>{service.durationMinutes} 分鐘 · {formatMoney(service.basePriceCents)} 起</strong></p>
      {query.error ? <div className="notice">請確認表單內容。你選擇的時段可能已經無法預約。</div> : null}
      <form className="panel form" action={createAppointment}>
        <input type="hidden" name="serviceId" value={service.id} />
        <label>地點
          <select name="locationId" required>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.name} · {formatMoney(location.locationPrices[0]?.priceCents ?? service.basePriceCents)}</option>
            ))}
          </select>
        </label>
        <div className="grid two">
          <label>日期<input type="date" name="date" required /></label>
          <label>時間<input type="time" name="time" required /></label>
        </div>
        <label>姓名<input name="clientName" required /></label>
        <div className="grid two">
          <label>Email<input name="clientEmail" type="email" required /></label>
          <label>電話<input name="clientPhone" required /></label>
        </div>
        <label>到府地址（只有到府服務需要填寫）<input name="customAddress" /></label>
        <label>備註<textarea name="note" rows={4} /></label>
        <button type="submit">送出預約申請</button>
      </form>
    </main>
  );
}
