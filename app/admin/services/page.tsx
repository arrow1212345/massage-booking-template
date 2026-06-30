import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

async function createService(formData: FormData) {
  "use server";
  await prisma.service.create({
    data: {
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      description: String(formData.get("description")),
      durationMinutes: Number(formData.get("durationMinutes")),
      basePriceCents: Math.round(Number(formData.get("price")) * 100),
    },
  });
  revalidatePath("/admin/services");
}

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <h1>服務管理</h1>
      <form action={createService} className="panel form">
        <input name="name" placeholder="服務名稱" required />
        <input name="slug" placeholder="service-slug" required />
        <textarea name="description" placeholder="服務介紹" required />
        <input name="durationMinutes" type="number" placeholder="60" required />
        <input name="price" type="number" step="0.01" placeholder="1200" required />
        <button>新增服務</button>
      </form>
      <div className="grid two" style={{ marginTop: 24 }}>
        {services.map((s) => <div className="card" key={s.id}><h2>{s.name}</h2><p>{s.description}</p><p>{s.durationMinutes} 分鐘 · {formatMoney(s.basePriceCents)}</p></div>)}
      </div>
    </>
  );
}
