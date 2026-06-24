---
name: jlpt-premium-ui
description: Build or redesign any page in the Mozhippattru (மொழிப்பற்று) JLPT LMS in its premium house style — warm washi + kintsugi gold + Shippori-Mincho serif over navy/red, with framer-motion entrance animation and real mobile responsiveness. Use whenever creating or restyling an LMS screen, dashboard, module page, card, KPI row, table, or header so it matches the brand instead of looking generic/AI-made.
---

# JLPT Premium UI

The house style for the Mozhippattru Japanese Language Center LMS. Apply it to every
new or redesigned screen so the app reads as one crafted brand, consistent with the
marketing site — not a generic admin template.

## The aesthetic in one line
Warm **washi paper** surfaces + **kintsugi gold** hairline accents + **Shippori Mincho
serif** headings/numerals, layered over the existing **navy (#1a1f3c) + red (#e84040)**.
Bilingual: a small gold **Japanese label** sits above English section/page titles.

## Design tokens (already in `globals.css :root` — always use these, never hardcode grays)
- `--paper #f6f1e7` (page bg), `--paper-2 #efe7d8`
- `--ink #2a2724` (text), `--ink-soft #6b665e` (secondary)
- `--gold #c2974b`, `--gold-soft #d8b878`
- `--line-warm rgba(40,32,20,0.10)` (all borders/dividers)
- `--display: 'Shippori Mincho', 'Noto Serif Tamil', serif` (headings + numerals)
- `--navy`, `--red`, `--red-hover` (brand), `--ivory` is now warm paper too
- Level colors: N5 `#22c55e`, N4 `#2d7dd2`, N3 `#c2974b`, N2 `#e84040`, N1 `#8b5cf6`

## Reusable building blocks
- **`@/components/DashboardKit`** (server-safe, no hooks):
  - `<DashStyles />` — drop once per page; provides all `.dash-*` classes.
  - `<Kpi label value sub? icon color />` — premium KPI card (serif value, accent bar).
  - `<CardHead jp title href? />` — card header with gold Japanese label + serif title.
  - Classes: `.dash-shell`, `.dash-main`, `.dash-header`/`.dash-eyebrow`/`.dash-title`/`.dash-datechip`,
    `.dash-kpis`, `.dash-grid` (1fr1fr), `.dash-grid-32` (3fr2fr), `.dash-span2`, `.dash-card`,
    `.dash-list`/`.dash-row`(`.accent`)/`.dash-row-title`/`.dash-row-sub`, `.dash-chip`,
    `.dash-btn`(`.dash-btn-red`/`.dash-btn-navy`), `.dash-bar`/`.dash-bar-fill`, `.dash-divrow`,
    `.dash-num`, `.dash-avatar`, `.dash-table`/`.dash-tablewrap`, `.dash-chart*`, `.dash-total`.
- **`@/components/StatCard`** — `<StatCard>` + `<StatGrid>` for module KPI rows (already premium:
  serif value, `--line-warm` border, color accent bar, auto-fit responsive). Prefer this in
  module pages that already use it; use `Kpi` in the dashboard pages.
- **`@/components/motion/Motion`** (`'use client'`): `<Reveal delay?>`, `<Stagger className>`,
  `<StaggerItem>` — framer-motion entrance. All honor `prefers-reduced-motion`.

## Page header pattern (use on EVERY screen)
Replace any `<h1 fontSize:20 color:#1d1d1f>` title with:
```tsx
<p style={{ fontFamily: 'var(--display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.04em', margin: '0 0 6px' }}>学生 · Students</p>
<h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Students</h1>
<p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '6px' }}>{subtitle}</p>
```
Pick a fitting Japanese label: Students 学生 · Teachers 先生 · Batches クラス · Courses コース ·
Attendance 出席 · Finance 授業料 · CRM 見込み客 · Colleges 大学 · Reports 報告 · Settings 設定.

## Entrance motion (dashboards / hero screens)
Wrap the header in `<Reveal>`, the KPI row in `<Stagger className="dash-kpis">` with each card
in `<StaggerItem>`, and each subsequent block in `<Reveal delay={0.12}>` (increase delay per row).
Pages stay server components; only these wrappers are client. Keep it to ONE orchestrated load
moment — don't animate everything.

## Mobile (non-negotiable — the client flagged this)
- Never leave a hardcoded `gridTemplateColumns: '1fr 1fr'` / `repeat(3/4,…)` without a collapse rule.
  Use `.dash-grid`/`.dash-grid-32` (collapse to 1col < 900px) or `StatGrid` (auto-fit minmax).
- Tables: wrap in `.dash-tablewrap` (scrolls) — never let them squish.
- Module page `<main>` keeps `marginLeft:260`; `globals.css` drops it to 0 + adds top padding
  for the hamburger drawer < 900px. The `Sidebar` drawer already works.
- Verify at 375px before shipping.

## Local preview of auth-gated pages (no production login)
Screenshots need the page to render without a real session. Temporarily: (a) add
`&& !pathname.startsWith('/dashboard…')` to the redirect in `src/proxy.ts`, and (b) wrap the
page's `if(!user) redirect('/login')` so it renders with a fallback name. Mark both edits
`__PREVIEW_BYPASS__`, screenshot desktop + 375px, then **revert both** (grep `__PREVIEW_BYPASS__`
returns nothing before committing). Do NOT query production Supabase for real student PII — the
auto-mode classifier blocks it.

## Preview tooling gotchas
- Don't override `requestAnimationFrame` or `clearInterval(allIds)` in `preview_eval` — it breaks
  `preview_screenshot` (timeouts). To freeze for a shot, set `animationPlayState='paused'` only.
- Don't run `npx next build` against the running dev server's `.next` (corrupts it) — stop the
  preview server first, or restart it after.

## Rollout checklist for a module page
1. Swap the page header to the serif + gold-eyebrow pattern.
2. Ensure KPI rows use `StatCard`/`StatGrid` (already premium) or `Kpi`.
3. Migrate body cards from old `cardStyle`/`#fff #ececef` to white + `--line-warm` + radius 14/16,
   serif card titles, gold dividers; replace gray text `#1d1d1f`/`#6e6e73` with `--ink`/`--ink-soft`.
4. Make every grid responsive; wrap tables in `.dash-tablewrap`.
5. Build (`npx next build`), preview desktop + 375px, then commit & push to `main` (auto-deploys
   to Vercel: japanese-lms-zeta.vercel.app).
