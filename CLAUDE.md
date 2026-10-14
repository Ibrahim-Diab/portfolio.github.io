# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static portfolio website for Ibrahim Diab (iOS Developer). No build tools, no package manager, no frameworks — vanilla HTML/CSS/JS served via GitHub Pages. The visual language follows the Apple-inspired design system in `~/Desktop/DESIGN.md`.

## Architecture

- **`index.html`** — Static sections: frosted black nav, centred hero (circular portrait above the eyebrow, on black), About + stats, placeholder `#work` for featured tiles, `#apps` grid, Experience, Capabilities, Contact, footer, and a native `<dialog>` project sheet.
- **`js/projects.js`** — Single source of truth for every project (`PROJECTS`, `CATEGORIES`). Featured tiles, the app grid, filter chips, the shipped-apps count and the screenshot sheet are all rendered from it.
- **`js/main.js`** — Renders the data, filter chips, the project sheet (tabs per app, horizontal screenshot track), mobile nav toggle, and the motion layer.
- **`css/style.css`** — Token layer on `:root` first (colors, type scale, spacing, radii, the single product shadow), then components. Components reference tokens only — no raw hex.

## Adding a project

Append an object to `PROJECTS` in `js/projects.js`:

- `status`: `"live"` | `"delisted"` (App Store page removed) | `"upcoming"` (in development) | `"delivered"` (handed to the client, no public store page). The grid lists live projects first, then upcoming, delivered, delisted.
- `apps`: one entry per App Store binary (`label`, optional `url`, `shots`, optional `status` overriding the project's, e.g. a captain app still in development). Multi-app products (client + captain/provider) are one project with several apps. `shots` may be `[]` before launch; the sheet then shows the icon instead.
- App cards show three screenshot thumbnails (or the icon on a plate when `shots` is empty), then icon, name, summary and store links; the name button stretches over the card, so clicking anywhere opens the screenshot sheet.
- `featured` (optional): `{ order, tagline, surface, highlights }`. `surface` is `"dark"`, `"dark-2"`, `"dark-3"`, `"parchment"` or `"light"`; `order` sets tile order. Alternate surfaces, and where two dark tiles must sit together use different micro-steps (`dark` then `dark-2`).

Screenshots go in `Projects_Images/<Name>/` as ~460px-wide WebP; icons in `App_Icons/`. App Store metadata, icons and screenshots can be pulled from `https://itunes.apple.com/lookup?id=<id>&country=sa` (swap the `…/NNNxNNNbb.jpg` suffix for `…/460x0w.webp`).

## Design rules (from DESIGN.md)

- One accent (`--color-primary`, `#2997ff` on dark surfaces). One shadow, on product screenshots only.
- Body 17px; weights 300/400/600/700 only (no 500); headlines 600 with negative tracking.
- Full-bleed tiles alternate light/parchment/dark with no borders — the surface change is the divider. Never put two dark tiles next to each other.
- Radii only from the token scale (0/5/8/11/18/pill). Buttons press with `scale(0.95)`; no hover states.

## Motion

Entrance states live in CSS; `js/main.js` only decides when to release them. Animate opacity and transform only.

- `.reveal` (plus `--soft`, `--zoom`, `--right`, `--slow`) hides an element until an IntersectionObserver adds `.is-visible`. Stagger with an inline `--anim-delay`.
- The hero animates on load: `body.is-loaded` releases `.hero__copy > *` (the portrait included), set over two animation frames so the start state paints first.
- `[data-parallax="<px>"]` elements get a scroll-linked `--parallax` offset written in one rAF pass; CSS applies `translate3d`.
- Stat numbers count up once in view; filtering replays the card entrance; the sheet fades and scales, and its screenshots stagger in.
- A tray or dialog cannot transition out of `display: none` — keep it laid out and use `visibility`/`opacity` (see the mobile nav tray).
- The hero eyebrow types through `data-roles` (one pending timer, paused off-screen); app cards tilt toward a mouse pointer with a glow (`initTilt`, fine pointers only); section heads with `.reveal--cascade` stagger their children; the nav shows reading progress and the active section; a back-to-top button appears after the first screen. All scroll-linked work runs from one `scrollTasks` loop.
- Everything above is disabled under `prefers-reduced-motion: reduce`, in both the stylesheet and `reduceMotion()`.

## Assets

- **`App_Icons/`** — App icons, `profile.webp` (hero portrait, 480px square head-and-shoulders crop shown as a ringed circle), `favicon.png` (round browser-tab icon), `avatar.png` (square apple-touch-icon), `og-image.jpg` (link preview), and the CV PDF.
- **`Projects_Images/<ProjectName>/`** — App Store screenshots per app.

## Development

Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8765
```

## External Dependencies

- Inter from Google Fonts (fallback only; Apple devices use SF Pro via `-apple-system`).
