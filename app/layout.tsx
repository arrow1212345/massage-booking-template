import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> { const settings = await prisma.siteSetting.findFirst().catch(() => null); return { title: settings?.siteName || "Massage Booking Template", description: settings?.homeSubtitle || "Massage booking website template." }; }
export default async function RootLayout({ children }: { children: React.ReactNode }) { const settings = await prisma.siteSetting.findFirst().catch(() => null); const brand = settings?.brandName || "Massage Studio"; return <html lang="en"><body><header className="header"><nav className="container nav"><Link href="/" className="brand">{brand}</Link><div className="links"><Link href="/services">Services</Link><Link href="/booking/massage-60">Book</Link><Link href="/client">Client Center</Link><Link href="/admin">Admin</Link></div></nav></header>{children}<footer className="footer"><div className="container"><p>Powered by Massage Booking Template. Configure your own brand, domain, and credentials before production use.</p></div></footer></body></html>; }
