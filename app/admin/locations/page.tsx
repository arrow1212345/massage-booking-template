import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function createLocation(formData: FormData) {
  "use server";
  await prisma.location.create({ data: { name: String(formData.get("name")), address: String(formData.get("address")), description: String(formData.get("description") || ""), requiresCustomAddress: formData.get("requiresCustomAddress") === "on" } });
  revalidatePath("/admin/locations");
}

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <h1>地點管理</h1>
      <form action={createLocation} className="panel form">
        <input name="name" placeholder="地點名稱" required />
        <input name="address" placeholder="地址" required />
        <textarea name="description" placeholder="地點說明" />
        <label><input type="checkbox" name="requiresCustomAddress" /> 需要客人填寫到府地址</label>
        <button>新增地點</button>
      </form>
      <div className="grid two" style={{ marginTop: 24 }}>{locations.map((l) => <div className="card" key={l.id}><h2>{l.name}</h2><p>{l.address}</p><p>{l.requiresCustomAddress ? "需要填寫到府地址" : "固定地點"}</p></div>)}</div>
    </>
  );
}
