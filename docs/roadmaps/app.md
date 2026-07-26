# <Business name> - Build roadmap · APP

Ships inside every DuckByte **app** build (marketing site + a login-gated owner dashboard: bookings
/ enquiries / content management). The quality bar a build clears before it reaches a client. Tick
as you ship. Status: 🟢 Now (launch-blocking) · 🔵 Next · ⚪ Later · ✅ standard. Effort: S (hours) ·
M (days) · L (week+). Put build-specific reasoning after the `·`.

**Where we are now.** _<one line: what's built, what's next. Never overstate.>_

## First pass (the launch bar) - 🟢
- [ ] Builds clean on Vercel (Next 16 + Turbopack, Tailwind v4); no console errors; routes smoke-tested
- [ ] On-brand to the chosen DuckByte design skill (fonts, colour tokens, spacing, tone)
- [ ] Marketing pages: hero, the real services/offer, social proof, about + FAQ where useful
- [ ] Real business info verbatim (name, services, hours, address, contact) - never invented
- [ ] Supabase schema created (one schema per build), RLS on every table
- [ ] Shared schema-bound client (`lib/supabaseClient.ts`) only; no self-made clients
- [ ] Public forms (contact / booking / enquiry) persist to the schema
- [ ] Login-gated `/dashboard`: full CRUD (list / add / edit / delete) per content table
- [ ] Submission tables (bookings, enquiries) show a list with per-row status updates
- [ ] Image fields UPLOAD to Supabase Storage (never "paste a URL")
- [ ] Branded 404
- [ ] Mobile-first; every nav / CTA / anchor resolves
- [ ] Legal pages (privacy / terms / cookies) + cookie banner

## 1. Technical SEO & discoverability
- [ ] Per-page metadata + canonical - 🟢 S
- [ ] JSON-LD: LocalBusiness / Organization, WebSite, FAQPage, Breadcrumb - 🟢 M · LocalBusiness only if locatable
- [ ] `robots.ts` + `sitemap.ts` - 🟢 S · noindex on `*.duckbyte.co`, index once a custom domain is attached
- [ ] Favicon set + icons + `manifest.ts` - 🟢 S
- [ ] OG / Twitter images per page (`next/og`) - 🔵 M
- [ ] Analytics + Search Console - 🔵 S · after go-live on a real domain
- [ ] a11y pass + Core Web Vitals (LCP / CLS / INP) - 🔵 M

## 2. Data & correctness
- [ ] Dashboard queries only tables that exist, by their EXACT names - 🟢 S
- [ ] SQL types mapped to TS correctly (never a SQL type name as a TS type) - 🟢 S
- [ ] Empty / loading / error states everywhere (never a blank block) - 🟢 S
- [ ] Owner notified on a new submission (booking / enquiry email) - 🔵 M
- [ ] Client analytics (visits / enquiries) surfaced in the dashboard - ⚪ M

## 3. Content & copy
- [ ] Copy in the business's real voice; no generic filler; NEVER an em dash - 🟢 S
- [ ] Microcopy + empty states read like a person wrote them - 🔵 S
- [ ] Gallery / portfolio if the business is visual - 🔵 S

## 4. Quality, infra & ops
- [ ] Auto-repair passed; build green - 🟢 ✅ standard
- [ ] Smoke test: forms submit, dashboard reads/writes, images load, links resolve, no console errors - 🟢 S
- [ ] Custom domain attach + DNS/SSL (care-plan go-live) - 🟢 S
- [ ] Security headers / basic CSP - 🔵 S
- [ ] Build/deploy failure surfaced to admin - 🔵 S · already emailed on exhausted repair
- [ ] Unit/e2e coverage of any custom logic - ⚪ M

## 5. Design system & brand
- [ ] Matches the picked style skill exactly - 🟢 ✅
- [ ] Logo / icon / OG from client assets or generated - 🟢 S
- [ ] Tasteful motion only where it earns its place; fast to load - 🔵 S

## Later
- [ ] Multi-page marketing (`/services`, `/menu`) when the brief warrants - ⚪ M
- [ ] Blog / content for SEO - ⚪ M
- [ ] Richer real data (hours / photos / reviews) to ground content - ⚪ M

## Decisions & open questions
**Resolved:** _<date + decisions made during the build>_
**Open:** _<anything the founder needs to confirm>_
