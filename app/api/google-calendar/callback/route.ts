import { redirect } from "next/navigation"; import { saveGoogleCode } from "@/lib/calendar";
export async function GET(request: Request) { const url = new URL(request.url); const code = url.searchParams.get("code"); if (code) await saveGoogleCode(code); redirect("/admin/calendar"); }
