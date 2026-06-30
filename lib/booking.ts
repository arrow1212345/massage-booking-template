import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
export async function nextBookingNumber() {
  const now = new Date();
  const prefix = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const count = await prisma.appointment.count({ where: { bookingNumber: { startsWith: prefix } } });
  return `${prefix}-${String(count + 1).padStart(3, "0")}`;
}
export async function isSlotAvailable(locationId: string, startsAt: Date, endsAt: Date, ignoreAppointmentId?: string) {
  const busy = await prisma.appointment.findFirst({ where: { id: ignoreAppointmentId ? { not: ignoreAppointmentId } : undefined, locationId, status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] }, startsAt: { lt: endsAt }, endsAt: { gt: startsAt } } });
  if (busy) return false;
  const blocked = await prisma.blockedTime.findFirst({ where: { startsAt: { lt: endsAt }, endsAt: { gt: startsAt } } });
  return !blocked;
}
