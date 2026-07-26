# <App name> - Product brief (DuckByte app / tool)

> The input that makes a one-pass build land. Keep it tight (bullets beat paragraphs). Fill it,
> then build against it and tick the roadmap for this build type: `docs/roadmaps/{site|app|tool}.md`.
> Delete these quote blocks once filled.

## What it is
> One paragraph: what the app/tool does and who uses it. Is it an **app** (marketing + dashboard)
> or a **tool** (app-only, dashboard is the product)?

## Users
> Who logs in and what they need to do (the owner, their team, their customers).

## Data model (the core)
> The tables and their key fields + relationships. This drives the schema and the whole app.
> Name the "content" tables (things the owner manages) and the "submission" tables (bookings,
> enquiries the public/customers create).

## Dashboard actions
> Per table: what the owner does (list, add, edit, delete, change status). Note any image/photo
> fields (these UPLOAD to Storage, never a pasted URL).

## Auth
> Single owner login (default) or real multi-user team accounts? Any customer-facing accounts?

## Integrations (tools)
> Anything to connect (CRM, calendar, accounting, an existing API). Leave blank if none.

## `[site only]` Marketing
> If it's an app (not a tool): the homepage sections and the contact/enquiry form.

## Out of scope (first pass)
> What we are explicitly NOT building yet. Keeps scope honest and seeds the ROADMAP "Later" list.

## Success criteria
> Clears the First-pass bar in `docs/roadmaps/{site|app|tool}.md`; builds clean; reads unmistakably as the business.
