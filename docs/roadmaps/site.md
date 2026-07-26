# <Business name> - Build roadmap · SITE

Ships inside every DuckByte **site** build (a marketing website, usually with a persisting contact
/ enquiry form - which is why it lives in this Supabase template). The quality bar a build clears
before it reaches a client. Tick as you ship. Status: 🟢 Now (launch-blocking) · 🔵 Next · ⚪ Later ·
✅ standard. Effort: S (hours) · M (days) · L (week+). Put build-specific reasoning after the `·`.

**Where we are now.** _<one line: what's built, what's next. Never overstate.>_

## First pass (the launch bar) - 🟢
- [ ] Builds clean on Vercel (Next 16 + Turbopack, Tailwind v4); no console errors; routes smoke-tested
- [ ] On-brand to the chosen DuckByte design skill (fonts, colour tokens, spacing, tone)
- [ ] Homepage: strong hero, the real services/offer, social proof, about + FAQ where useful
- [ ] Real business info verbatim (name, services, hours, address, contact) - never invented
- [ ] Contact / enquiry form that PERSISTS to Supabase (RLS on the table) - not a dead `mailto`
- [ ] Branded 404
- [ ] Mobile-first; every nav / CTA / anchor resolves
- [ ] Legal pages (privacy / terms / cookies) + cookie banner
- [ ] Fast: images sized, no layout shift, loads instantly on a phone

## 1. Technical SEO & discoverability
- [ ] Per-page metadata + canonical - 🟢 S
- [ ] JSON-LD: LocalBusiness / Organization, WebSite, FAQPage, Breadcrumb - 🟢 M · LocalBusiness only if locatable
- [ ] `robots.ts` + `sitemap.ts` - 🟢 S · noindex on `*.duckbyte.co`, index once a custom domain is attached
- [ ] Favicon set + icons + `manifest.ts` - 🟢 S
- [ ] OG / Twitter images per page (`next/og`) - 🔵 M
- [ ] Analytics + Search Console - 🔵 S · after go-live on a real domain
- [ ] a11y pass + Core Web Vitals (LCP / CLS / INP) - 🔵 M

## 2. Content & copy
- [ ] Copy in the business's real voice; no generic filler; NEVER an em dash - 🟢 S
- [ ] The one job (book / enquire / call / view menu) is obvious and easy - 🟢 S
- [ ] Microcopy + empty states read like a person wrote them - 🔵 S
- [ ] Gallery / portfolio if the business is visual - 🔵 S

## 3. Quality, infra & ops
- [ ] Auto-repair passed; build green - 🟢 ✅ standard
- [ ] Smoke test: the form submits, images load, links resolve, no console errors - 🟢 S
- [ ] Custom domain attach + DNS/SSL (care-plan go-live) - 🟢 S
- [ ] Security headers / basic CSP - 🔵 S

## 4. Design system & brand
- [ ] Matches the picked style skill exactly - 🟢 ✅
- [ ] Logo / icon / OG from client assets or generated - 🟢 S
- [ ] Tasteful motion only where it earns its place - 🔵 S

## Later
- [ ] Multi-page (`/services`, `/menu`) when the brief warrants - ⚪ M
- [ ] Blog / content for SEO - ⚪ M
- [ ] Richer real data (hours / photos / reviews) to ground content - ⚪ M

## Decisions & open questions
**Resolved:** _<date + decisions made during the build>_
**Open:** _<anything the founder needs to confirm>_
