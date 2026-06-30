import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [pending, confirmed] = await Promise.all([
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
  ]);
  return (
    <>
      <h1>後台總覽</h1>
      <div className="grid two">
        <div className="card"><h2>{pending}</h2><p>待確認預約</p></div>
        <div className="card"><h2>{confirmed}</h2><p>已確認預約</p></div>
      </div>
    </>
  );
}
