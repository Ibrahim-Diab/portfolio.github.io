# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static portfolio website for Ibrahim Diab (iOS Developer). No build tools, no package manager — vanilla HTML/CSS/JS served via GitHub Pages.

## Architecture

- **`index.html`** — Single-page site with all sections: Navbar, Hero (profile photo), About, Experience (timeline), Projects (card grid with screenshot galleries), Footer, and a Bootstrap modal for full-size screenshot viewing.
- **`css/style.css`** — Dark theme using CSS custom properties (`--bg: #0f172a`, `--accent: #f59e0b`). Key patterns: glassmorphism navbar, scroll-reveal animations, hover-triggered screenshot carousels, timeline component.
- **`js/main.js`** — IntersectionObserver for scroll reveals, screenshot track setup (calculates scroll duration from image widths, plays on hover), Bootstrap modal population from `data-images` JSON attribute on project cards.

## Key Patterns

**Project cards** use data attributes (`data-title`, `data-icon`, `data-images`) to drive the screenshot modal. The gallery overlay (app icon + name) sits on top of the screenshot track with `backdrop-filter: blur` and fades out on hover to reveal scrolling screenshots.

**Screenshot tracks** duplicate images in the HTML so the CSS `translateX(-50%)` animation loops seamlessly. The JS calculates duration from actual rendered widths.

**Scroll reveal** uses `.reveal` / `.reveal-delay-1` classes. The observer adds `.visible` once, then unobserves.

## Assets

- **`App_Icons/`** — App icons, profile photo (`profile.png`), and CV PDF
- **`Projects_Images/<ProjectName>/`** — App Store screenshots per project (mixed .png/.webp)

## Development

Open `index.html` directly in a browser — no server needed. For live reload during development:

```bash
npx serve .
```

## External Dependencies (CDN)

- Bootstrap 5.3.3 (CSS + JS bundle)
- Font Awesome 5.6.1
