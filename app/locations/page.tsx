import Link from "next/link";
import { prisma } from "@/lib/prisma";

const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    where: { isActive: true },
    include: {
      availabilityRules: { where: { isActive: true }, orderBy: [{ weekday: "asc" }, { startTime: "asc" }] },
      locationPrices: { where: { isActive: true }, include: { service: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <main>
      <section className="container hero" style={{ paddingBottom: 28 }}>
        <div>
          <p className="eyebrow">服務地點</p>
          <h1>讓客人知道在哪裡服務</h1>
          <p className="lead">地點頁會讀取後台啟用中的服務地點，適合放工作室、合作空間、到府服務或不同縣市的服務資訊。</p>
        </div>
        <div className="panel">
          <h2>地點會影響預約</h2>
          <p>每個地點可以有不同服務、價格與可預約時段。正式使用時，請在後台建立地點並確認地址與服務價格。</p>
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 20 }}>
        <div className="grid two">
          {locations.map((location) => (
            <article className="card location-card" key={location.id}>
              <p className="eyebrow">Location</p>
              <h2>{location.name}</h2>
              <p className="location-address">{location.address}</p>
              {location.description ? <p>{location.description}</p> : <p>請在後台補上地點說明，例如交通方式、停車資訊、入口位置或到府服務範圍。</p>}
              <div className="service-meta">
                <span className="pill">{location.requiresCustomAddress ? "需填到府地址" : "固定地點"}</span>
                <span className="pill">{location.locationPrices.length} 項服務</span>
              </div>
              <div className="location-detail-block">
                <h3>可預約時段</h3>
                {location.availabilityRules.length ? (
                  <ul className="clean-list compact">
                    {location.availabilityRules.map((rule) => <li key={rule.id}>{weekdays[rule.weekday]} {rule.startTime} - {rule.endTime}</li>)}
                  </ul>
                ) : <p>尚未設定時段。</p>}
              </div>
              <div className="location-detail-block">
                <h3>可預約服務</h3>
                {location.locationPrices.length ? (
                  <ul className="clean-list compact">
                    {location.locationPrices.map((pricing) => <li key={pricing.id}>{pricing.service.name}</li>)}
                  </ul>
                ) : <p>尚未設定服務價格。</p>}
              </div>
              <Link className="button" href="/booking/massage-60">前往預約</Link>
            </article>
          ))}
        </div>
        {!locations.length ? <div className="notice">目前沒有啟用中的地點。請到後台新增服務地點。</div> : null}
      </section>
    </main>
  );
}
