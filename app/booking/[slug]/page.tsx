import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isSlotAvailable, nextBookingNumber } from "@/lib/booking";
import { sendEmail } from "@/lib/email";
import { BookingWizard } from "./booking-wizard";

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
    <main className="container booking-page">
      <div className="booking-heading">
        <p className="eyebrow">線上預約</p>
        <h1>一步一步完成預約</h1>
        <p className="lead">示範站採用分段式流程，讓客人一次只處理一件事：確認服務、選地點、選時間、填資料，再送出申請。</p>
      </div>
      <BookingWizard
        service={{ id: service.id, name: service.name, description: service.description, durationMinutes: service.durationMinutes, basePriceCents: service.basePriceCents }}
        locations={locations.map((location) => ({
          id: location.id,
          name: location.name,
          address: location.address,
          requiresCustomAddress: location.requiresCustomAddress,
          priceCents: location.locationPrices[0]?.priceCents ?? service.basePriceCents,
        }))}
        action={createAppointment}
        hasError={Boolean(query.error)}
      />
    </main>
  );
}
