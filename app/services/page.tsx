import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { durationMinutes: "asc" }],
  });

  return (
    <main className="container" style={{ padding: "56px 0" }}>
      <p className="eyebrow">服務項目</p>
      <h1>按摩服務</h1>
      <div className="grid two">
        {services.map((service) => (
          <div className="card" key={service.id}>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p>{service.durationMinutes} 分鐘 · {formatMoney(service.basePriceCents)}</p>
            <Link className="button" href={`/booking/${service.slug}`}>預約這項服務</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
