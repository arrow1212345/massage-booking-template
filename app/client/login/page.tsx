import { redirect } from "next/navigation";
import { setClientSession } from "@/lib/auth";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (email) {
    await setClientSession(email);
    redirect("/client/appointments");
  }
}

export default function ClientLoginPage() {
  return (
    <main className="container" style={{ padding: "72px 0" }}>
      <div className="panel">
        <h1>客戶中心</h1>
        <p>模板預設使用 Email session 方便本機測試。正式上線前，可依需求改成一次性登入連結或 LINE Login。</p>
        <form action={login} className="form">
          <label>Email<input name="email" type="email" required /></label>
          <button>繼續</button>
        </form>
      </div>
    </main>
  );
}
