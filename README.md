# OO Travel Portal

Multilingual travel-assistance platform for **Omar Oukhira** (MEI 63.588.045/0001-49, São Paulo).
Public marketing site + secure client portal + admin panel, with PT / EN / FR / AR (RTL) support.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, next-intl, and Supabase.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to the default locale (`/pt`).

The app ships in **mock mode** (`NEXT_PUBLIC_MOCK_MODE=true` in `.env.local`): auth is
bypassed, and all data comes from `lib/mock-data.ts`, so every screen is browsable without
any backend. Sign in on `/login` with any value to enter the portal.

### Key routes

| Area    | Path                         |
|---------|------------------------------|
| Public  | `/pt`, `/pt/services`, `/pt/about`, `/pt/contact`, `/pt/login` |
| Portal  | `/pt/portal`, `/pt/portal/bookings`, `/portal/documents`, `/portal/messages`, `/portal/invoices`, `/portal/profile` |
| Admin   | `/pt/admin`, `/admin/clients`, `/admin/documents`, `/admin/messages`, `/admin/invoices` |

Swap `pt` for `en`, `fr`, or `ar`. Arabic renders the whole document RTL.

## Going to production

1. **Supabase** — create a project, run `supabase/schema.sql` in the SQL editor (tables,
   RLS policies, `documents` storage bucket). Fill the `NEXT_PUBLIC_SUPABASE_*` and
   `SUPABASE_SERVICE_ROLE_KEY` vars in `.env.local` and set `NEXT_PUBLIC_MOCK_MODE=false`.
2. **Prisma** — set `DATABASE_URL`, then `npm run prisma:generate`.
3. **Payments** — add `MERCADO_PAGO_ACCESS_TOKEN` + `MERCADO_PAGO_WEBHOOK_SECRET`; the PIX
   flow lives in `lib/mercadopago.ts` and `app/api/payments/*`.
4. **WhatsApp AI** — add `ANTHROPIC_API_KEY`, `ZAPI_*`, and wire `app/api/messages/webhook`
   (or n8n) to Z-API. Logic in `lib/claude.ts` + `lib/zapi.ts`.
5. **Email** — add `RESEND_API_KEY` for transactional notifications.

See `.env.example` for the full variable list, and the technical specification for the
phased build plan.

## Project layout

```
app/[locale]/        (public) · (portal) · (admin) route groups
app/api/             payments, messages webhook, document signed URLs
components/          ui/ primitives · portal/ · public/ · shared
lib/                 supabase helpers, integrations (stubs in mock mode), mock data
messages/            pt · en · fr · ar translation catalogues
prisma/ · supabase/  schema (Prisma) and Postgres + RLS SQL
```
