# <App name> - Build roadmap · TOOL

Ships inside every DuckByte **tool** build: an app-only internal tool (NO marketing site) where the
login-gated dashboard IS the product. Same template as app builds, marketing pages removed. The
quality bar a build clears before it reaches a client. Tick as you ship. Status: 🟢 Now
(launch-blocking) · 🔵 Next · ⚪ Later · ✅ standard. Effort: S (hours) · M (days) · L (week+).

**Where we are now.** _<one line: what's built, what's next. Never overstate.>_

## First pass (the launch bar) - 🟢
- [ ] Builds clean on Vercel (Next 16 + Turbopack, Tailwind v4); no console errors; routes smoke-tested
- [ ] On-brand to the chosen DuckByte design skill (fonts, colour tokens, spacing, tone)
- [ ] NO marketing pages; `app/page.tsx` routes straight to the login-gated app
- [ ] `noindex` (internal tool - never indexed); no sitemap; no legal/cookie chrome needed
- [ ] Supabase schema created (one schema per build), RLS on every table
- [ ] Shared schema-bound client (`lib/supabaseClient.ts`) only; no self-made clients
- [ ] The tool: full CRUD (list / add / edit / delete) across every content table, in clear views
- [ ] Queue / submission tables show a list with per-row status updates
- [ ] Image / file fields UPLOAD to Supabase Storage (never "paste a URL")
- [ ] Auth gates the whole app (middleware); the owner can sign in
- [ ] Branded 404; favicon + icons + `manifest.ts`

## 1. Data & correctness
- [ ] Queries only tables that exist, by their EXACT names - 🟢 S
- [ ] SQL types mapped to TS correctly (never a SQL type name as a TS type) - 🟢 S
- [ ] Empty / loading / error states everywhere (never a blank block) - 🟢 S
- [ ] Optimistic updates + clear success/error feedback on writes - 🔵 S
- [ ] Validation on inputs (required fields, formats) - 🔵 S

## 2. Usability (the operator comes first)
- [ ] Fast data entry: sensible tab order, keyboard-friendly forms - 🟢 S
- [ ] Filters / search / sort on the big tables - 🔵 M
- [ ] Bulk actions where they save real time - ⚪ M
- [ ] a11y basics (labels, focus states, contrast) - 🔵 S
- [ ] Usable on mobile / tablet if used on the floor - 🔵 S

## 3. Access & security
- [ ] Middleware gates every route; no data leaks to anon - 🟢 S
- [ ] Real multi-user team accounts (beyond a single owner login) - 🔵 L · when >1 user needs in
- [ ] Roles / permissions if multiple team members - ⚪ M
- [ ] Security headers / basic CSP - 🔵 S

## 4. Integrations & automation
- [ ] Connect the systems they already run (CRM / calendar / accounting / existing API) - 🔵 M
- [ ] Webhooks / scheduled jobs if the workflow needs them - ⚪ M
- [ ] Export (CSV / print) of the core objects - 🔵 S

## 5. Quality, infra & ops
- [ ] Auto-repair passed; build green - 🟢 ✅ standard
- [ ] Smoke test: every CRUD path reads/writes, no console errors - 🟢 S
- [ ] Custom domain attach + DNS/SSL if they want one (else stays on the subdomain) - 🔵 S
- [ ] Build/deploy failure surfaced to admin - 🔵 S
- [ ] Unit/e2e coverage of any custom logic - ⚪ M

## 6. Design system & brand
- [ ] Matches the picked style skill exactly - 🟢 ✅
- [ ] Dense-but-clean layout suited to daily use; tasteful, no motion for its own sake - 🔵 S

## Later
- [ ] Roles / audit log for teams - ⚪ M
- [ ] AI / assistant hooks over the tool's data - ⚪ M

## Decisions & open questions
**Resolved:** _<date + decisions made during the build>_
**Open:** _<anything the founder needs to confirm>_
