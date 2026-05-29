# Muhammad Hassan Jawwad — Portfolio

A 3D, motion-rich personal portfolio for **Muhammad Hassan Jawwad** (Software Engineer · Pakistan · Remote). An interactive React Three Fiber scene fronts content surfaces — About, Projects, and Contact — all driven by typed data and a live GitHub stats panel.

## Stack

- **Vite** + **React 18**
- **React Three Fiber** / **drei** / **three** (island, biplane, bird, fox scene)
- **Tailwind CSS**
- **react-router-dom**, **react-vertical-timeline-component**
- Typed content layer in `src/data/*.ts` (transpiled by Vite/esbuild — no separate build step)

## Project layout

```
src/
├── data/            # typed source of truth (profile, projects, experience, skills, testimonials, github)
├── lib/             # github-stats.ts (KPI aggregation + live api.github.com fetch)
├── components/      # Navbar, Footer, HomeInfo, GithubStats, Testimonials, AvailabilityBadge, …
├── pages/           # Home (3D), About, Projects, Contact
├── models/          # R3F model components
└── assets/          # 3D models, icons, images (logo-hj.svg monogram)
scripts/
└── generate-github.mjs   # regenerates the GitHub snapshot (runs on prebuild)
```

The 3D scene is decorative and content-agnostic. All copy and data come from `src/data/*`.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # runs `prebuild` (GitHub snapshot refresh) then `vite build`
npm run preview    # preview the production build
```

`prebuild` calls `npm run gh:snapshot`, which refreshes `src/data/github.generated.json` from the public GitHub API. If the API is unreachable, it logs a warning and keeps the committed snapshot, so the build never fails on a transient network/rate-limit issue.

## GitHub stats

`GithubStats` fetches live public-repo data from `api.github.com` on mount (unauthenticated, no token) and falls back to the committed snapshot on rate-limit/offline, with a live/cached provenance badge.

## Contact

The contact form composes a `mailto:` to `hassanjawwad01@gmail.com` — no backend, no third-party email service, no keys.

## Deploy (Netlify)

- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing via `public/_redirects` (`/* /index.html 200`)
- Optional headers via `netlify.toml`

Live site: **https://hassan-3d-portfolio.netlify.app** — used as the absolute origin for canonical / OG / Twitter / JSON-LD (`index.html`), `public/robots.txt`, and `public/sitemap.xml`. If the domain ever changes, update those three files.
