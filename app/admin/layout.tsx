import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
  return (
    <main className="container" style={{ padding: "32px 0" }}>
      <div className="links" style={{ marginBottom: 24, justifyContent: "flex-start" }}>
        <Link href="/admin">總覽</Link>
        <Link href="/admin/appointments">預約</Link>
        <Link href="/admin/services">服務</Link>
        <Link href="/admin/locations">地點</Link>
        <Link href="/admin/availability">可預約時段</Link>
        <Link href="/admin/calendar">日曆</Link>
        <Link href="/admin/settings">網站設定</Link>
      </div>
      {children}
    </main>
  );
}
