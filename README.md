# Massage Booking Template

An open-source massage appointment website template built with Next.js, Prisma, PostgreSQL, and Vercel. It includes a public massage site, booking flow, basic admin operations, client appointment lookup, Email notifications, LINE integration placeholders, and Google Calendar availability sync.

## Features

- Public massage landing page and service description page
- Online booking with service, location, date, time, and client details
- Admin dashboard for appointments, services, locations, availability, calendar, and site settings
- Client center for viewing appointments and requesting basic changes
- Google Calendar OAuth hooks for checking busy time and writing confirmed bookings
- Resend email notification helper
- LINE Login / Messaging API placeholders for client login and notifications
- Clean Prisma schema designed for future paid upgrades such as coupons, packages, referrals, and review automation

## Quick Start

```bash
cp .env.example .env.local
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000.

Default seed admin password is the value you set in `ADMIN_PASSWORD`.

## Required Environment Variables

Set these before deploying:

- `DATABASE_URL` and `DIRECT_URL`: PostgreSQL connection strings
- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`: admin login security
- `CLIENT_SESSION_SECRET`: client session signing
- `NEXT_PUBLIC_APP_URL`: public site URL
- `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, `RESEND_API_KEY`: email delivery
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `CALENDAR_ENCRYPTION_KEY`: Google Calendar integration
- `LINE_LOGIN_CHANNEL_ID`, `LINE_LOGIN_CHANNEL_SECRET`, `LINE_LOGIN_STATE_SECRET`, `LINE_MESSAGING_CHANNEL_SECRET`, `LINE_MESSAGING_CHANNEL_ACCESS_TOKEN`: LINE integration
- `CRON_SECRET`: future scheduled jobs

Keep real credentials in Vercel environment variables or another secret manager. Never commit `.env` files.

## Vercel Deployment

1. Create a PostgreSQL database.
2. Set all production environment variables in Vercel.
3. Deploy the project.
4. Run `npm run prisma:deploy` during deployment or from a trusted environment.
5. Visit `/admin/login` and configure services, locations, availability, and notification settings.

## Integrations

### Google Calendar

Create an OAuth Web Client in Google Cloud and set the callback URL to:

```text
https://your-domain.example/api/google-calendar/callback
```

After deployment, open `/admin/calendar` and connect the owner's calendar. Bookings can then check busy periods and create events when confirmed.

### Resend Email

Create a Resend API key, verify your sender domain, then set `RESEND_API_KEY` and `EMAIL_FROM`.

### LINE

Create LINE Login and Messaging API channels. Configure callback URLs according to the routes shown in the admin pages. If LINE variables are missing, the app will keep working with Email-only notifications.

## Security Checklist Before Publishing

```bash
leak-hunter . --redact --min-risk 40
git ls-files | rg "\.env|\.vercel|HANDOFF|deployment-context|codex-handoff"
rg "your-real-domain|your-private-email|your-real-line-id|private-handoff"
```

Expected result: no real credentials and no private deployment files.

## Upgrade Path

The v1 schema keeps stable users, appointments, services, and locations. Paid or advanced modules can later add coupons, packages, referrals, birthday campaigns, review invitations, and LINE AI workflows through additive Prisma migrations without rewriting existing client or appointment records.
