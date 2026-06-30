# Massage Booking Template

> English documentation is below the Traditional Chinese section.

## 繁體中文

一套開源的按摩預約網站模板，使用 Next.js、Prisma、PostgreSQL 與 Vercel 建置。適合按摩師、運動按摩工作室、徒手調整或身體放鬆服務，作為線上預約與基本後台管理的起點。

### 功能

- 按摩首頁與服務說明頁
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

- Massage landing page and service description page
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
