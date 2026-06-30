import Link from "next/link";
import { prisma } from "@/lib/prisma";

const values = [
  { title: "先理解身體狀況", text: "在服務前先了解客人的緊繃位置、生活型態與希望改善的感受，再安排適合的按摩方式。" },
  { title: "清楚說明服務方式", text: "讓客人知道這次會怎麼進行、適合哪些狀況，以及服務後需要注意什麼。" },
  { title: "保留調整彈性", text: "每位客人的身體感受不同，模板適合改成你的專業流程與實際營運方式。" },
];

export default async function AboutPage() {
  const settings = await prisma.siteSetting.findFirst();
  const brand = settings?.brandName || "按摩工作室";

  return (
    <main>
      <section className="container hero" style={{ paddingBottom: 28 }}>
        <div>
          <p className="eyebrow">關於我</p>
          <h1>讓客人先認識你的專業與服務方式</h1>
          <p className="lead">這個頁面提供給使用模板的人撰寫自己的背景、服務理念、證照、經驗與適合服務的客群。</p>
          <div className="actions">
            <Link className="button" href="/booking/massage-60">預約示範</Link>
            <Link className="button secondary" href="/services">查看服務</Link>
          </div>
        </div>
        <div className="profile-card">
          <div className="profile-photo" aria-hidden="true">{brand.slice(0, 1)}</div>
          <p className="eyebrow">Profile template</p>
          <h2>{brand}</h2>
          <p>請將這段改成你的個人介紹，例如服務年資、擅長項目、學習背景、證照、服務地區與你希望客人知道的安心資訊。</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Service philosophy</p>
              <h2>可以放你的服務理念</h2>
            </div>
            <p>按摩服務不是只有價格與時間。對陌生客人來說，服務者的專業、溝通方式與安全感也很重要。</p>
          </div>
          <div className="grid three">
            {values.map((value) => (
              <div className="card" key={value.title}>
                <div className="icon-badge">✓</div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid two">
          <div className="panel">
            <p className="eyebrow">What to write</p>
            <h2>建議填寫內容</h2>
            <ul className="clean-list">
              <li>你的服務背景與擅長項目</li>
              <li>適合預約的客群與常見問題</li>
              <li>證照、訓練經歷或合作經驗</li>
              <li>服務前後注意事項</li>
            </ul>
          </div>
          <div className="panel">
            <p className="eyebrow">About content</p>
            <h2>正式使用時</h2>
            <p>正式使用時，請把這裡改成你的個人介紹、證照、經驗、服務理念與服務禁忌，讓客人預約前更安心。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
