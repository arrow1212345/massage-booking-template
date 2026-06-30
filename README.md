# Massage Booking Template

> English documentation is below the Traditional Chinese section.

## 繁體中文

一套開源的按摩預約網站模板，使用 Next.js、Prisma、PostgreSQL 與 Vercel 建置。適合按摩師、運動按摩工作室、徒手調整或身體放鬆服務，作為線上預約與基本後台管理的起點。

### 功能

- 按摩首頁、關於我頁、服務說明頁與服務地點頁
- 線上預約流程：服務、地點、日期、時間與客戶資料
- 基本後台：預約、服務、地點、可預約時間、Google Calendar、網站設定
- 客戶中心：查看自己的預約紀錄
- Email 通知基礎功能
- LINE Login / Messaging API 的整合入口
- Google Calendar OAuth：可連接日曆並在確認預約時建立事件
- Prisma schema 提供清楚的核心資料結構

### 快速開始

```bash
cp .env.example .env.local
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

打開 http://localhost:3000。

後台登入密碼請設定在 `.env.local` 的 `ADMIN_PASSWORD`。

### 建議使用 Codex 或 Claude Code 架站

如果你不熟悉程式，可以把這個 repo 交給 Codex 或 Claude Code 協助架設。建議先要求 AI 不要立刻修改程式，而是先完成一輪架站訪談，確認所有營運資訊後再開始設定。

你可以直接貼上這段指令：

```text
請協助我用這個 Massage Booking Template 架設一個按摩預約網站。
在開始修改程式或部署前，請先逐項詢問我需要的網站資訊，包含品牌、服務、價格、地點、可預約時段、通知方式、Google Calendar、LINE、Email、後台密碼與部署網域。
請整理成設定清單讓我確認，確認後再進行修改、資料庫 seed、環境變數設定與部署。
不要使用任何範例金鑰，也不要把 .env 或正式金鑰提交到 GitHub。
```

AI 應先詢問並確認這些內容：

- 品牌名稱、網站名稱、首頁標題、首頁說明文字
- 關於我內容：個人背景、服務理念、證照、經驗、適合服務的客群
- 主要服務項目：名稱、介紹、時間長度、價格、緩衝時間、是否啟用
- 服務地點：店名、地址、交通方式、停車資訊、是否需要客人填寫到府地址、哪些服務可在該地點預約
- 可預約時段：每週可預約星期、開始時間、結束時間、固定休息時段
- 預約流程：是否需要後台確認、取消或改期規則、預約成功後要顯示什麼
- 客戶資料欄位：姓名、電話、Email、備註、是否需要地址
- 通知方式：只用 Email、只用 LINE、或 Email + LINE
- Email 設定：寄件網域、寄件人名稱、管理員收件信箱
- LINE 設定：是否使用 LINE Login、Messaging API、圖文選單或推播通知
- Google Calendar：要連接哪個 Google 帳號、是否用日曆事件阻擋可預約時段
- 後台設定：管理員密碼、網站設定、是否開放 demo mode
- 部署設定：Vercel 專案名稱、正式網域、資料庫供應商與地區
- 安全檢查：確認 `.env`、`.vercel`、正式 token、私人 handoff 文件都沒有被提交

建議流程是：

1. 先完成訪談與設定清單。
2. 修改 seed 與預設文案。
3. 設定環境變數。
4. 建立資料庫並執行 migration。
5. 部署到 Vercel。
6. 測試首頁、服務頁、預約頁、後台、Email、LINE 與 Google Calendar。
7. 最後再 commit / push。

### 必要環境變數

部署前請設定：

- `DATABASE_URL`、`DIRECT_URL`：PostgreSQL 資料庫連線
- `ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`：後台登入安全設定
- `CLIENT_SESSION_SECRET`：客戶中心 session 簽章
- `NEXT_PUBLIC_APP_URL`：正式網站網址
- `EMAIL_FROM`、`ADMIN_NOTIFICATION_EMAIL`、`RESEND_API_KEY`：Email 寄送
- `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`、`GOOGLE_REDIRECT_URI`、`CALENDAR_ENCRYPTION_KEY`：Google Calendar 整合
- `LINE_LOGIN_CHANNEL_ID`、`LINE_LOGIN_CHANNEL_SECRET`、`LINE_LOGIN_STATE_SECRET`、`LINE_MESSAGING_CHANNEL_SECRET`、`LINE_MESSAGING_CHANNEL_ACCESS_TOKEN`：LINE 整合
- `CRON_SECRET`：排程任務驗證

正式金鑰請放在 Vercel Environment Variables 或其他 secret manager，不要提交 `.env` 檔案。

### Vercel 部署

1. 建立 PostgreSQL 資料庫。
2. 在 Vercel 設定所有 production 環境變數。
3. 部署專案。
4. 部署時執行 `npm run prisma:deploy`，或在可信任環境手動執行。
5. 進入 `/admin/login` 設定服務、地點、可預約時間與通知方式。

### 整合設定

#### Google Calendar

在 Google Cloud 建立 OAuth Web Client，callback URL 設為：

```text
https://your-domain.example/api/google-calendar/callback
```

部署後進入 `/admin/calendar` 連接日曆。確認預約時可建立 Google Calendar 事件。

#### Resend Email

建立 Resend API key，完成寄件網域驗證後，設定 `RESEND_API_KEY` 與 `EMAIL_FROM`。

#### LINE

建立 LINE Login 與 Messaging API channel，並依照後台或程式路由設定 callback URL。若 LINE 相關環境變數未設定，網站仍可用 Email 通知方式運作。

### 發布前安全檢查

```bash
leak-hunter . --redact --min-risk 40
git ls-files | rg "\.env|\.vercel|HANDOFF|deployment-context|codex-handoff"
rg "your-real-domain|your-private-email|your-real-line-id|private-handoff"
```

預期結果：沒有真實金鑰、私人部署檔案或個人資料。

### 來源標註

本專案以公開開源方式提供。你可以依照授權條款使用、修改與部署本專案。

若你將本專案作為基礎進行延伸、改版、商業化包裝、教學範例或建立衍生專案，請在 README、網站說明頁、文件或專案頁面中保留清楚的來源標註，例如：

```text
Based on Massage Booking Template by arrow1212345
https://github.com/arrow1212345/massage-booking-template
```

這樣可以讓使用者知道原始專案來源，也能協助其他人回到原始版本查看更新與安全修正。

---

## English

Massage Booking Template is an open-source appointment website template built with Next.js, Prisma, PostgreSQL, and Vercel. It is designed for massage therapists, sports massage studios, bodywork providers, and wellness services that need a simple booking website with basic admin tools.

### Features

- Massage landing page, about page, service description page, and locations page
- Online booking flow for service, location, date, time, and client details
- Basic admin dashboard for appointments, services, locations, availability, Google Calendar, and site settings
- Client center for viewing appointment records
- Basic Email notification support
- LINE Login / Messaging API integration entry points
- Google Calendar OAuth for connecting a calendar and creating events after appointment confirmation
- Clear core Prisma schema for the booking system

### Quick Start

```bash
cp .env.example .env.local
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000.

Set the admin login password in `.env.local` as `ADMIN_PASSWORD`.

### Recommended Setup With Codex or Claude Code

If you are not comfortable configuring the project manually, you can ask Codex or Claude Code to set up the website with you. The agent should not start editing immediately. It should first interview you, collect the required business information, and then ask you to confirm the setup plan.

You can paste this prompt:

```text
Please help me set up this Massage Booking Template as a massage appointment website.
Before changing code or deploying, ask me for every required website detail, including brand, services, pricing, locations, availability, notification channels, Google Calendar, LINE, Email, admin password, and deployment domain.
Summarize the setup checklist for my confirmation. After I confirm, update the project, seed data, environment variables, and deployment.
Do not use example credentials, and never commit .env files or production secrets to GitHub.
```

The agent should ask for and confirm:

- Brand name, site name, homepage title, and homepage description
- About page content: owner background, service philosophy, certifications, experience, and ideal clients
- Services: name, description, duration, price, buffer time, and enabled status
- Locations: studio name, address, transportation notes, parking notes, whether clients must enter a custom in-home address, and which services are available there
- Availability: available weekdays, start time, end time, and regular break times
- Booking workflow: whether admin confirmation is required, cancellation/rescheduling rules, and success page copy
- Client fields: name, phone, Email, notes, and whether address is required
- Notification channels: Email only, LINE only, or Email + LINE
- Email settings: sending domain, sender name, and admin notification inbox
- LINE settings: LINE Login, Messaging API, rich menu, and push notification requirements
- Google Calendar: which Google account to connect and whether calendar events should block availability
- Admin settings: admin password, site settings, and whether demo mode should be enabled
- Deployment: Vercel project name, production domain, database provider, and database region
- Security check: verify that `.env`, `.vercel`, production tokens, and private handoff files are not committed

Suggested setup flow:

1. Complete the setup interview and checklist.
2. Update seed data and default copy.
3. Configure environment variables.
4. Create the database and run migrations.
5. Deploy to Vercel.
6. Test the homepage, services page, booking flow, admin dashboard, Email, LINE, and Google Calendar.
7. Commit and push only after the site is verified.

### Required Environment Variables

Set these before deployment:

- `DATABASE_URL`, `DIRECT_URL`: PostgreSQL connection strings
- `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`: admin login security
- `CLIENT_SESSION_SECRET`: client session signing
- `NEXT_PUBLIC_APP_URL`: public site URL
- `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, `RESEND_API_KEY`: Email delivery
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `CALENDAR_ENCRYPTION_KEY`: Google Calendar integration
- `LINE_LOGIN_CHANNEL_ID`, `LINE_LOGIN_CHANNEL_SECRET`, `LINE_LOGIN_STATE_SECRET`, `LINE_MESSAGING_CHANNEL_SECRET`, `LINE_MESSAGING_CHANNEL_ACCESS_TOKEN`: LINE integration
- `CRON_SECRET`: scheduled task verification

Keep real credentials in Vercel Environment Variables or another secret manager. Do not commit `.env` files.

### Vercel Deployment

1. Create a PostgreSQL database.
2. Set all production environment variables in Vercel.
3. Deploy the project.
4. Run `npm run prisma:deploy` during deployment or from a trusted environment.
5. Visit `/admin/login` to configure services, locations, availability, and notification settings.

### Integrations

#### Google Calendar

Create an OAuth Web Client in Google Cloud and set the callback URL to:

```text
https://your-domain.example/api/google-calendar/callback
```

After deployment, open `/admin/calendar` and connect the calendar. Confirmed appointments can create Google Calendar events.

#### Resend Email

Create a Resend API key, verify your sending domain, then set `RESEND_API_KEY` and `EMAIL_FROM`.

#### LINE

Create LINE Login and Messaging API channels, then configure callback URLs according to the app routes. If LINE environment variables are not configured, the app can still operate with Email notifications.

### Security Checklist Before Publishing

```bash
leak-hunter . --redact --min-risk 40
git ls-files | rg "\.env|\.vercel|HANDOFF|deployment-context|codex-handoff"
rg "your-real-domain|your-private-email|your-real-line-id|private-handoff"
```

Expected result: no real credentials, private deployment files, or personal data.

### Attribution

This project is provided as open-source software. You may use, modify, and deploy it under the license terms.

If you use this project as the basis for an extended version, redesign, commercial package, tutorial, or derivative project, please keep a clear attribution in your README, documentation, website credits, or project page. For example:

```text
Based on Massage Booking Template by arrow1212345
https://github.com/arrow1212345/massage-booking-template
```

This helps users identify the original project and makes it easier for others to find updates and security fixes from the source repository.
