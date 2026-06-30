const { PrismaClient, NotificationEventType, NotificationChannelPolicy } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {
      siteName: '按摩預約網站模板',
      brandName: '按摩工作室',
      homeTitle: '讓客人更容易完成預約',
      homeSubtitle: '一套適合按摩師、運動按摩工作室與身體放鬆服務使用的線上預約網站。',
      contactEmail: 'owner@example.com',
    },
    create: {
      id: 'default',
      siteName: '按摩預約網站模板',
      brandName: '按摩工作室',
      homeTitle: '讓客人更容易完成預約',
      homeSubtitle: '一套適合按摩師、運動按摩工作室與身體放鬆服務使用的線上預約網站。',
      contactEmail: 'owner@example.com',
    },
  });
  const service = await prisma.service.upsert({
    where: { slug: 'massage-60' },
    update: {
      name: '客製化按摩 60 分鐘',
      description: '依照肩頸、背部、臀腿或運動後恢復需求，安排重點放鬆與徒手調整。',
      durationMinutes: 60,
      bufferMinutes: 15,
      basePriceCents: 120000,
      sortOrder: 1,
    },
    create: {
      slug: 'massage-60',
      name: '客製化按摩 60 分鐘',
      description: '依照肩頸、背部、臀腿或運動後恢復需求，安排重點放鬆與徒手調整。',
      durationMinutes: 60,
      bufferMinutes: 15,
      basePriceCents: 120000,
      sortOrder: 1,
    },
  });
  const location = await prisma.location.upsert({
    where: { id: 'demo-location' },
    update: {
      name: '示範工作室',
      address: '台北市範例區健康路 123 號',
      description: '正式上線前，請改成你的工作室地址或服務地點。',
    },
    create: {
      id: 'demo-location',
      name: '示範工作室',
      address: '台北市範例區健康路 123 號',
      description: '正式上線前，請改成你的工作室地址或服務地點。',
    },
  });
  await prisma.serviceLocationPricing.upsert({
    where: { serviceId_locationId: { serviceId: service.id, locationId: location.id } },
    update: { priceCents: 120000 },
    create: { serviceId: service.id, locationId: location.id, priceCents: 120000 },
  });
  for (const weekday of [1, 2, 3, 4, 5]) {
    await prisma.availabilityRule.upsert({
      where: { id: `demo-${weekday}` },
      update: { startTime: '10:00', endTime: '18:00' },
      create: { id: `demo-${weekday}`, locationId: location.id, weekday, startTime: '10:00', endTime: '18:00' },
    });
  }
  for (const eventType of Object.values(NotificationEventType)) {
    await prisma.notificationSetting.upsert({
      where: { eventType },
      update: {},
      create: { eventType, channelPolicy: NotificationChannelPolicy.EMAIL_ONLY },
    });
  }
}
main().finally(() => prisma.$disconnect());
