# OO Travel — Test Access Guide

The site runs in **mock mode** (`NEXT_PUBLIC_MOCK_MODE=true` in `.env.local`):
no Supabase, Mercado Pago, Z-API, or Anthropic account is needed. Auth is
bypassed and every page is backed by sample data from `lib/mock-data.ts`.

## 1. Start the server

```bash
cd oo-travel
npm run dev
```

Open **http://localhost:3000** (redirects to `/pt`). Swap the locale segment
for `/en`, `/fr`, or `/ar` (Arabic renders right-to-left).

## 2. Login

`/login` — type **anything** in the email field (password is not required in
mock mode) and click **Sign in**. You're dropped straight into `/portal`.
"Send magic link" shows a success toast without sending a real email.

There is no separate admin login — `/admin` is reached via the **"Admin"**
link at the bottom of the portal sidebar (and vice versa, `/portal` from the
admin sidebar's **"Client portal"** link). Both are open in mock mode.

## 3. Public site checklist

| Page | What to test |
|---|---|
| `/` (home) | Hero video/poster, AIDA sections, 8 service cards, testimonials, floating photo gallery (hover to pause), request form submit → success toast, WhatsApp floating button |
| `/services` | All 8 services incl. car rental with driver |
| `/about` | MEI/CNPJ credentials, languages |
| `/contact` | Form submit → toast, WhatsApp button |
| `/legal/privacy`, `/cookies`, `/terms`, `/booking-terms` | Footer links, content renders, EN fallback notice on `/fr` and `/ar` |
| Cookie banner | Appears on first visit (bottom), Accept/Reject persists via localStorage |
| Locale switcher (navbar) | PT/EN/FR/AR, layout mirrors on AR |
| Mobile | Resize to ~375px — hamburger menu, stacked grids, no horizontal scroll |

## 4. Client portal checklist (`/portal`)

| Page | What to test |
|---|---|
| Dashboard | Welcome banner with days-to-next-trip countdown, 4 stat cards, quick actions, bookings chart |
| Bookings | List with status badges; **New request** → 3-step wizard; pick **Car rental with driver** to see the dynamic pickup/drop-off/vehicle fields |
| Documents | Drag-and-drop a file (or click to browse) → appears as "pending"; file-type icon colors (PDF red, JPG indigo, PNG green) |
| Messages | Send a message → simulated AI auto-reply appears after ~1s with the "AI" badge |
| Invoices | **Pay with PIX** on an unpaid invoice → QR modal with countdown; **"Pagamento confirmado"** button simulates the webhook marking it paid |
| Profile | Edit name/phone/language, Save → success toast |

## 5. Admin panel checklist (`/admin`)

| Page | What to test |
|---|---|
| Overview | Stats, recent bookings, document review queue |
| Clients | List + search input |
| Bookings | All bookings across all mock clients |
| Documents | Approve / Reject buttons update the status badge live |
| Messages | Switch between client conversations, toggle AI agent on/off per client |
| Invoices | Full invoice list with status |

## 6. Known limits of mock mode

- Submitted forms (contact, new booking, profile) show a success toast but
  don't persist — refreshing resets to the seeded mock data.
- PIX QR code is a placeholder image, not a real payable code.
- WhatsApp buttons open a real `wa.me/5511933210241` link.
- No real auth: any "login" reaches the same single mock client account.

## 7. Switching to a real backend later

Set `NEXT_PUBLIC_MOCK_MODE=false` and fill in the Supabase/Mercado
Pago/Z-API/Anthropic keys in `.env.local` (see `.env.example`). The auth
middleware (`middleware.ts`) will then enforce real Supabase sessions on
`/portal` and `/admin` again.
