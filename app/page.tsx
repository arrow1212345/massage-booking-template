import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { durationMinutes: "asc" }],
      take: 3,
    }),
  ]);

  return (
    <main>
      <section className="container hero">
        <div>
          <p className="eyebrow">按摩預約</p>
          <h1>{settings?.homeTitle || "讓客人更容易完成預約"}</h1>
          <p style={{ fontSize: 22 }}>
            {settings?.homeSubtitle || "一套適合按摩師、運動按摩工作室與身體放鬆服務使用的線上預約網站。"}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <Link className="button" href="/booking/massage-60">立即預約</Link>
            <Link className="button secondary" href="/services">查看服務</Link>
          </div>
        </div>
        <div className="panel">
          <h2>為按摩工作室設計</h2>
          <p>客人可以線上選擇服務、地點、日期與時間；後台則專注在確認預約、管理服務與設定可預約時段。</p>
        </div>
      </section>
      <section className="container" style={{ paddingBottom: 56 }}>
        <h2>熱門服務</h2>
        <div className="grid three">
          {services.map((service) => (
            <Link key={service.id} href={`/booking/${service.slug}`} className="card" style={{ textDecoration: "none" }}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <strong>{service.durationMinutes} 分鐘 · {formatMoney(service.basePriceCents)}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
