import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSetting.findFirst().catch(() => null);
  return {
    title: settings?.siteName || "按摩預約網站模板",
    description: settings?.homeSubtitle || "適合按摩工作室使用的線上預約網站模板。",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSetting.findFirst().catch(() => null);
  const brand = settings?.brandName || "按摩工作室";

  return (
    <html lang="zh-Hant">
      <body>
        <header className="header">
          <nav className="container nav">
            <Link href="/" className="brand">{brand}</Link>
            <div className="links">
              <Link href="/about">關於我</Link>
              <Link href="/services">服務項目</Link>
              <Link href="/locations">服務地點</Link>
              <Link href="/booking/massage-60">立即預約</Link>
              <Link href="/client">客戶中心</Link>
              <Link href="/admin">後台</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="footer">
          <div className="container">
            <p>此為 Massage Booking Template 示範站。正式上線前，請改成自己的品牌、網域、服務內容與第三方金鑰。</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
