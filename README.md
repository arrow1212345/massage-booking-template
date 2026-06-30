# Massage Booking Template

一套開源的按摩預約網站模板，使用 Next.js、Prisma、PostgreSQL 與 Vercel 建置。適合按摩師、運動按摩工作室、徒手調整或身體放鬆服務，作為線上預約與基本後台管理的起點。

## 功能

- 按摩首頁與服務說明頁
- 線上預約流程：服務、地點、日期、時間與客戶資料
- 基本後台：預約、服務、地點、可預約時間、Google Calendar、網站設定
- 客戶中心：查看自己的預約紀錄
- Email 通知基礎功能
- LINE Login / Messaging API 的整合入口
- Google Calendar OAuth：可連接日曆並在確認預約時建立事件
- Prisma schema 保留清楚的核心資料結構，方便依照自己的營運需求延伸

## 快速開始

```bash
cp .env.example .env.local
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

打開 http://localhost:3000。

後台登入密碼請設定在 `.env.local` 的 `ADMIN_PASSWORD`。

## 必要環境變數

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

## Vercel 部署

1. 建立 PostgreSQL 資料庫。
2. 在 Vercel 設定所有 production 環境變數。
3. 部署專案。
4. 部署時執行 `npm run prisma:deploy`，或在可信任環境手動執行。
5. 進入 `/admin/login` 設定服務、地點、可預約時間與通知方式。

## 整合設定

### Google Calendar

在 Google Cloud 建立 OAuth Web Client，callback URL 設為：

```text
https://your-domain.example/api/google-calendar/callback
```

部署後進入 `/admin/calendar` 連接日曆。確認預約時可建立 Google Calendar 事件。

### Resend Email

建立 Resend API key，完成寄件網域驗證後，設定 `RESEND_API_KEY` 與 `EMAIL_FROM`。

### LINE

建立 LINE Login 與 Messaging API channel，並依照後台或程式路由設定 callback URL。若 LINE 相關環境變數未設定，網站仍可用 Email 通知方式運作。

## 發布前安全檢查

```bash
leak-hunter . --redact --min-risk 40
git ls-files | rg "\.env|\.vercel|HANDOFF|deployment-context|codex-handoff"
rg "your-real-domain|your-private-email|your-real-line-id|private-handoff"
```

預期結果：沒有真實金鑰、私人部署檔案或個人資料。

## 延伸開發

這個模板保留預約系統常用的核心資料：客戶、預約、服務、地點、可預約時間、通知紀錄與日曆連接。你可以依自己的需求繼續加入折扣、評價、會員、方案或其他營運功能。
