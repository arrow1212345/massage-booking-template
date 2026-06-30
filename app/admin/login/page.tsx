import { redirect } from "next/navigation";
import { setAdminSession } from "@/lib/auth";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  if (password && password === process.env.ADMIN_PASSWORD) {
    await setAdminSession();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export default function AdminLoginPage() {
  return (
    <main className="container" style={{ padding: "72px 0" }}>
      <div className="panel">
        <h1>後台登入</h1>
        <form action={login} className="form">
          <label>密碼<input name="password" type="password" required /></label>
          <button type="submit">登入</button>
        </form>
      </div>
    </main>
  );
}
