---
name: 21st-dev
description: Pull in and adapt UI components from 21st.dev (the shadcn-compatible React/Tailwind component registry) to speed up building screens in this project. Use when adding a prebuilt component/block (table, dialog, tabs, hero, pricing, navbar, card, form, data-table, etc.) instead of hand-coding it — and ALWAYS re-theme it to the Mozhippattru washi/gold/serif brand so it doesn't look generic. Pairs with the jlpt-premium-ui skill.
---

# 21st.dev components

[21st.dev](https://21st.dev) is a marketplace of React + Tailwind components built on the
shadcn/ui convention. Components are installed through the shadcn registry CLI using a 21st.dev
URL, then live in `src/components/ui/` and are composed into pages.

## ⚠️ The brand rule (most important)
21st.dev / shadcn components ship in a **generic default look** — the exact "AI-generated"
feel the client flagged. **Every pulled component MUST be re-themed to the brand before use**
(see jlpt-premium-ui for tokens). Pull the *structure/behavior*, then restyle:
- colors → `var(--paper)`, `var(--ink)`, `var(--ink-soft)`, `var(--gold)`, `var(--navy)`, `var(--red)`
- headings/numerals → `font-[family-name:var(--display)]` (Shippori Mincho)
- borders → `var(--line-warm)`; radius 10–16px; warm shadows
Use Tailwind arbitrary values to reach the CSS vars, e.g. `bg-[var(--paper)] text-[var(--ink)]`.

## Project foundation (already set up — don't re-init)
- `components.json` (aliases: ui → `@/components/ui`, utils → `@/lib/utils`).
- `src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge).
- Deps: `class-variance-authority`, `clsx`, `tailwind-merge`, `@21st-dev/registry`, Tailwind v4.
- Branded base components exist: `@/components/ui/button` (variants: default/navy/gold/outline/
  ghost/soft), `@/components/ui/badge`. Reuse/extend these.
- Do **NOT** run `npx shadcn init` — it would overwrite `globals.css` and clobber the brand
  tokens. The foundation is already in place manually.

## How to pull a component
1. Find it on 21st.dev and copy its registry URL (`https://21st.dev/r/<author>/<slug>`).
2. Add it:
   ```bash
   npx shadcn@latest add "https://21st.dev/r/<author>/<slug>"
   ```
   (Run from the `japanese-lms` folder, Node on PATH. If it prompts to install a Radix dep,
   allow it. Interactive prompts can hang headless — prefer running it where you can answer, or
   install the listed deps + copy the component source manually.)
3. The component lands in `src/components/ui/`. **Immediately re-theme it** per the brand rule.
4. Interactive components (Dialog, Tabs, Dropdown, Popover, Tooltip…) pull in `@radix-ui/*`
   deps — fine, but check the build after.

## When NOT to use 21st.dev
- For basic Button/Badge/Card/KPI — the project already has branded ones
  (`@/components/ui/*`, `StatCard`, `DashboardKit`). Don't duplicate.
- 21st.dev shines for **bigger composed blocks**: data tables, complex dialogs, multi-step
  forms, command palettes, calendars, charts, marketing sections.

## Workflow to redesign a module body with it
1. Pick the block on 21st.dev (e.g. a data-table for the Students/Invoices table).
2. `npx shadcn add <url>` → re-theme to washi/gold/serif.
3. Swap the module's hand-rolled table/markup for it; keep the page's data wiring.
4. Build (`npx next build`), preview desktop + 375px (use the `__PREVIEW_BYPASS__` trick from
   jlpt-premium-ui for auth-gated pages), then commit & push to `main` (auto-deploys to Vercel).

## Alternative: 21st.dev "Magic" MCP
21st.dev also offers a "Magic" MCP server that generates components from a prompt. If it's
connected as an MCP, prefer it for one-off custom blocks; otherwise use the registry CLI above.
Either way, the brand rule still applies — re-theme the output.
