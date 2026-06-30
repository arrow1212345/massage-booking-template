import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { durationMinutes: "asc" }],
  });

  return (
    <main>
      <section className="container hero" style={{ paddingBottom: 24 }}>
        <div>
          <p className="eyebrow">服務項目</p>
          <h1>把按摩服務整理得清楚好懂</h1>
          <p className="lead">每個服務都能設定名稱、介紹、時間、價格與可預約地點。安裝後請把這裡改成你自己的服務內容。</p>
        </div>
        <div className="panel">
          <h2>服務頁用途</h2>
          <p>讓客人先理解服務差異，再進入預約流程。適合放入運動按摩、筋膜放鬆、伸展、到府服務或其他按摩項目。</p>
        </div>
      </section>
      <section className="container section" style={{ paddingTop: 20 }}>
        <div className="grid two">
          {services.map((service) => (
            <div className="card service-card" key={service.id}>
              <p className="eyebrow">Massage service</p>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <div className="service-meta">
                <span className="pill">{service.durationMinutes} 分鐘</span>
                <span className="pill">{formatMoney(service.basePriceCents)} 起</span>
              </div>
              <Link className="button" href={`/booking/${service.slug}`}>預約這項服務</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
