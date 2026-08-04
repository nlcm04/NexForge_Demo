# NexForge Capital — Website

A self-contained, single-page cinematic website for NexForge Capital, inspired by the
design and scroll-driven effect of Tucker's Farm Corp — adapted to the NexForge brand
(Ironstone Navy + Forge Amber) and messaging.

## What's inside

```
nexforge-site/
├── index.html    # all page markup (single-page scroll)
├── styles.css    # brand system, layout, animations, responsive
├── script.js     # forge canvas animation, scroll reveals, nav, counters, form
└── README.md
```

No build step, no dependencies, no framework. Just static files.

## Run it locally

**Option 1 — open directly**
Double-click `index.html`. It works from `file://`.

**Option 2 — serve it (recommended)**
A local server avoids any browser file-path quirks:

```bash
# from inside the nexforge-site folder
python -m http.server 8080
# then open http://localhost:8080
```

or, if you prefer Node:

```bash
npx serve .
```

## Logo

An original minimal wordmark: lowercase **"nexforge"** in a bold neutral sans (navy) with an
**orange nexus dot** and **CAPITAL** letter-spaced beneath. No box — clean and modern. In the nav
the wordmark is white over the dark hero and turns navy once you scroll onto the white bar; the
dot stays LM-orange throughout.

- `favicon.svg` — navy tile with white **n.** monogram (orange dot) for the browser tab.
- `assets/logo-lockup.svg` — primary wordmark logo for light backgrounds.
- `assets/logo-mark.svg` / `logo-mark-navy.svg` — wordmark for light backgrounds.
- `assets/logo-mark-ondark.svg` — white wordmark for dark backgrounds.

The on-page logo is live text; colours live in `styles.css` (`.bw-name`, `.bw-dot`, `.bw-sub`).
The wordmark uses a bold neutral sans (Arial/Helvetica) for a clean, institutional feel.

## Language switch (EN / VI)

A live English⇄Vietnamese toggle sits in the top-right of the nav. Every piece of copy carries
`data-en` / `data-vi` attributes; clicking **EN** or **VI** swaps the whole page instantly and
remembers the choice (localStorage) for the visitor's next visit. Form validation messages are
translated too. To edit wording, change the matching `data-en` / `data-vi` attribute in
`index.html`. To add a new translatable element, give it both attributes.

## Features / effects

- **Animated "forge" hero** — a `<canvas>` renders rising embers + a heat glow over a navy
  gradient (no video file needed). Repeated, lighter, in the closing "Start the conversation" band.
- **Sticky nav** that turns from transparent (over the hero) to solid-white on scroll.
- **Scroll-reveal** fade/slide animations via `IntersectionObserver`, with subtle stagger.
- **Animated stat counters** that count up when scrolled into view.
- **Editorial timelines** for the partnership process and the company story.
- **Rounded sans-serif type** — the whole site uses **Quicksand** (rounded display) + **Nunito**
  (rounded body), loaded from Google Fonts with system fallbacks. Both support Vietnamese.
- **Vietnam story + philosophy** — the "Story" section tells Vietnam's market arc (Đổi Mới → WTO →
  rising power → the great handover) and closes on five philosophy tenets. No third-party firm is
  referenced anywhere on the site.
- **Deal-intake modal** — the founder CTAs ("Explore a partnership", "Start a confidential
  conversation") open a confidential submission form (name, company, sector, revenue, email,
  message). Demo only — wire `#intakeForm` to your CRM to receive real submissions.
- **Scroll-progress bar** and **back-to-top** button for longer-page usability.
- **Team section (Tucker's-style)** — a bold hover-highlight **name list** plus a **portrait grid**
  of the four leaders; clicking any name or portrait opens a **bio pop-up**. Photos are installed in
  `team/`; bilingual bios live in the `TEAM` array in `script.js`. See `team/README.txt`.
- **Dual-audience split** — For Founders / For Investors.
- **Interactive "who are you" picker + email capture** (demo only — see below).
- **Fully responsive** with a mobile menu, and **`prefers-reduced-motion`** support
  (animations disable automatically for users who request it).

## Fonts

Uses **Fraunces** (display) + **Inter** (body) from Google Fonts for the premium look.
If you're offline, it falls back gracefully to Georgia + system sans.
To make the site 100% offline, self-host those two fonts and swap the `<link>` in `index.html`.

## Making it production-ready

- **Forms:** the connect form is a front-end demo that stores nothing. Wire it to your CRM
  (HubSpot / Pipedrive) or a form service (Formspree, Basin) to capture real leads.
- **Content:** all copy lives in `index.html` — edit in place. Stats cite public 2024–2026
  sources and are directional; confirm before publishing.
- **Logo:** the nav uses a simple inline SVG "forge N" placeholder — swap for your final mark.
- **Domain / hosting:** drop these files on any static host (Webflow export slot, Netlify,
  Vercel, Cloudflare Pages, or your own server). Add the domain `nexforge.vn`.
- **Analytics & consent:** add GA4 + a PDPD-compliant cookie/consent banner before launch.
- **Bilingual:** duplicate copy blocks for a Vietnamese (VN) version and add a language toggle.

## Browser support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox). Canvas, IntersectionObserver
and CSS grid are all standard.
