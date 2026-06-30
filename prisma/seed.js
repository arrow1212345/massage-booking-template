const { PrismaClient, NotificationEventType, NotificationChannelPolicy } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.siteSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default', siteName: 'Massage Booking Template', brandName: 'Massage Studio', homeTitle: 'Massage appointments made simple', homeSubtitle: 'A calm booking website for massage therapists and bodywork studios.', contactEmail: 'owner@example.com' } });
  const service = await prisma.service.upsert({ where: { slug: 'massage-60' }, update: {}, create: { slug: 'massage-60', name: 'Custom Massage Session', description: 'A focused massage session for shoulder, back, hip, or training recovery needs.', durationMinutes: 60, bufferMinutes: 15, basePriceCents: 12000, sortOrder: 1 } });
  const location = await prisma.location.upsert({ where: { id: 'demo-location' }, update: {}, create: { id: 'demo-location', name: 'Demo Studio', address: '123 Wellness Ave, Sample City', description: 'Replace this with your studio address before production.' } });
  await prisma.serviceLocationPricing.upsert({ where: { serviceId_locationId: { serviceId: service.id, locationId: location.id } }, update: {}, create: { serviceId: service.id, locationId: location.id, priceCents: 12000 } });
  for (const weekday of [1,2,3,4,5]) await prisma.availabilityRule.upsert({ where: { id: `demo-${weekday}` }, update: {}, create: { id: `demo-${weekday}`, locationId: location.id, weekday, startTime: '10:00', endTime: '18:00' } });
  for (const eventType of Object.values(NotificationEventType)) await prisma.notificationSetting.upsert({ where: { eventType }, update: {}, create: { eventType, channelPolicy: NotificationChannelPolicy.EMAIL_ONLY } });
}
main().finally(() => prisma.$disconnect());
