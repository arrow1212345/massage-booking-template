import Link from "next/link";

export default async function BookingSuccessPage({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const params = await searchParams;
  return (
    <main className="container" style={{ padding: "72px 0" }}>
      <div className="panel">
        <p className="eyebrow">預約申請已收到</p>
        <h1>謝謝你</h1>
        <p>你的預約申請已儲存，工作室會盡快確認時間。</p>
        {params.booking ? <p>預約編號：<strong>{params.booking}</strong></p> : null}
        <Link className="button" href="/client">前往客戶中心</Link>
      </div>
    </main>
  );
}
