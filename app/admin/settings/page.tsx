import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function saveSettings(formData: FormData) {
  "use server";
  const data = {
    brandName: String(formData.get("brandName")),
    homeTitle: String(formData.get("homeTitle")),
    homeSubtitle: String(formData.get("homeSubtitle")),
    contactEmail: String(formData.get("contactEmail") || ""),
  };
  await prisma.siteSetting.upsert({ where: { id: "default" }, update: data, create: { id: "default", ...data } });
  revalidatePath("/");
}

export default async function AdminSettingsPage() {
  const s = await prisma.siteSetting.findFirst();
  return (
    <>
      <h1>網站設定</h1>
      <form action={saveSettings} className="panel form">
        <label>品牌名稱<input name="brandName" defaultValue={s?.brandName || "按摩工作室"} /></label>
        <label>首頁標題<input name="homeTitle" defaultValue={s?.homeTitle || "讓客人更容易完成預約"} /></label>
        <label>首頁說明<textarea name="homeSubtitle" defaultValue={s?.homeSubtitle || ""} /></label>
        <label>聯絡 Email<input name="contactEmail" defaultValue={s?.contactEmail || ""} /></label>
        <button>儲存設定</button>
      </form>
    </>
  );
}
