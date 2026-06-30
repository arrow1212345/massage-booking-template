import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

const audiences = [
  { title: "肩頸腰背緊繃", text: "讓客人快速理解哪些狀況適合預約，也方便你改成自己的服務定位。", icon: "舒" },
  { title: "運動後恢復", text: "可放入運動按摩、筋膜放鬆、伸展或其他身體調整服務。", icon: "動" },
  { title: "固定客戶管理", text: "客戶可線上送出預約，後台集中管理服務、地點與可預約時段。", icon: "約" },
];

const steps = [
  { title: "客人選服務", text: "服務名稱、時間、價格與地點都可在後台或 seed 資料中調整。" },
  { title: "送出預約申請", text: "客人填寫姓名、電話、Email、備註與必要地址。" },
  { title: "後台確認", text: "管理者確認預約後，可寄出通知並建立 Google Calendar 事件。" },
];

const adminFeatures = ["服務與價格", "地點與地址", "可預約時段", "日曆整合", "Email / LINE", "客戶中心"];

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { durationMinutes: "asc" }],
      take: 3,
    }),
  ]);

  return (
    <main>
      <section className="container hero">
        <div>
          <p className="eyebrow">按摩預約網站模板</p>
          <h1>{settings?.homeTitle || "讓客人更容易完成預約"}</h1>
          <p className="lead">
            {settings?.homeSubtitle || "一套適合按摩師、運動按摩工作室與身體放鬆服務使用的線上預約網站。"}
          </p>
          <div className="actions">
            <Link className="button" href="/booking/massage-60">體驗預約流程</Link>
            <Link className="button secondary" href="/services">查看服務頁</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-visual">
            <div className="demo-window">
              <p className="eyebrow">Demo booking</p>
              <div className="demo-row"><span className="demo-label">服務</span><span className="demo-value">客製化按摩 60 分鐘</span></div>
              <div className="demo-row"><span className="demo-label">地點</span><span className="demo-value">示範工作室</span></div>
              <div className="demo-row"><span className="demo-label">狀態</span><span className="demo-value">待後台確認</span></div>
            </div>
            <div className="stat-strip">
              <div className="stat"><strong>3 步</strong><span>完成預約</span></div>
              <div className="stat"><strong>後台</strong><span>集中管理</span></div>
              <div className="stat"><strong>可接</strong><span>LINE / Email</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Who it is for</p>
              <h2>適合想快速上線的按摩服務</h2>
            </div>
            <p>這個模板不是品牌成品，而是一個可被 Codex 或 Claude Code 快速改成你自己網站的起點。</p>
          </div>
          <div className="grid three">
            {audiences.map((item) => (
              <div className="card" key={item.title}>
                <div className="icon-badge">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>服務卡片可直接替換成你的項目</h2>
            </div>
            <Link className="button secondary" href="/services">完整服務頁</Link>
          </div>
          <div className="grid three">
            {services.map((service) => (
              <Link key={service.id} href={`/booking/${service.slug}`} className="card service-card" style={{ textDecoration: "none" }}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-meta">
                  <span className="pill">{service.durationMinutes} 分鐘</span>
                  <span className="pill">{formatMoney(service.basePriceCents)} 起</span>
                </div>
                <span className="button sage" style={{ marginTop: "auto" }}>預約示範</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Booking flow</p>
            <h2>把預約流程變得清楚</h2>
            <p>模板保留最基本、最容易理解的預約流程。你可以再依實際營運加入付款、套票、折價券、評價或 LINE 對話預約。</p>
          </div>
          <div className="grid steps">
            {steps.map((step) => (
              <div className="card step" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container feature-band">
          <div>
            <p className="eyebrow">Admin ready</p>
            <h2>不是只有前台，也有基本後台</h2>
            <p>服務、地點、可預約時間、預約狀態、Google Calendar 與通知設定，都有基本管理入口。</p>
          </div>
          <div className="grid two">
            {adminFeatures.map((feature) => <span className="pill" key={feature}>{feature}</span>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid two">
          <div className="panel">
            <p className="eyebrow">Customize with AI</p>
            <h2>交給 Codex 或 Claude Code 客製化</h2>
            <p>README 已整理好架站訪談清單。安裝者可以請 AI 先問清楚品牌、服務、價格、地點、時段、通知、LINE、Email 與 Google Calendar，再開始修改。</p>
          </div>
          <div className="panel">
            <p className="eyebrow">安全提醒</p>
            <h2>範例站不放正式金鑰</h2>
            <p>示範站使用假資料。正式部署時，所有資料庫、Email、LINE 與 Google Calendar 金鑰都應放在 Vercel Environment Variables，不要提交到 GitHub。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
