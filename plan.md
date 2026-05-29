# Refactor Plan — Personalize the 3D Portfolio to Hassan's Data

**Status: FINAL (2026-05-29).** All decisions locked, all assets in place. Ready to execute on request (not yet started).

> Goal: take this repo (Adrian Hajdin / JS Mastery "3D Portfolio", Vite + React 18 + R3F + Tailwind, all `.jsx`, data hardcoded in `src/constants/index.js`) and rewire every content surface to be driven by **your** typed data from
> `hassanjawwad12/brutalist-design-FE-Portfolio@terminal-based-portfolio/src/data` —
> plus wire in **live GitHub stats** via your `src/lib/github-stats.ts`.
>
> The 3D scene (island, plane, bird, fox, sky) is decorative and content-agnostic — it **stays**. We only swap the *content/data layer* and the copy.

---

## 0. Current vs. Target — the gap

### What this repo has today
| Surface | File | Data source today |
|---|---|---|
| Hero 3D scene + stage captions | `src/pages/Home.jsx`, `src/components/HomeInfo.jsx` | Hardcoded "Adrian", "Croatia 🇭🇷" |
| About (bio + skills + experience timeline) | `src/pages/About.jsx` | `constants.skills`, `constants.experiences` (icon-image based) |
| Projects grid | `src/pages/Projects.jsx` | `constants.projects` (SVG-icon based) |
| Contact (3D fox + form) | `src/pages/Contact.jsx` | EmailJS keys in `.env` (JSM's), hardcoded `to_email: sujata@jsmastery.pro` |
| Footer socials | `src/components/Footer.jsx` | `constants.socialLinks` |
| Navbar logo | `src/components/Navbar.jsx` | `assets/images/logo.svg` (JSM logo) |
| Page title / favicon | `index.html` | "Adrian Hajdin \| Portfolio" |
| **GitHub stats** | — | **does not exist** |
| **Testimonials** | — | **does not exist** |

All content lives in one untyped file: `src/constants/index.js` (`skills`, `experiences`, `socialLinks`, `projects`).

### What your data provides (source of truth)
From `…/terminal-based-portfolio/src/data/` and `src/lib/`:

| File | Export | Shape (key fields) |
|---|---|---|
| `profile.ts` | `profile: Profile` | `name, shortName, role, location, availability, tagline, bio, email, socials[{label,href,handle}]` |
| `projects.ts` | `projects: Project[]` | `id, index, title, description, role, year, stack[], href, repo?, status("live"\|"case study"\|"archived")` |
| `experience.ts` | `experience: ExperienceItem[]` | `id, title, org?, orgHref?, period, summary, highlights[]` |
| `skills.ts` | `skills: Skill[]` | `id, label, group("frontend"\|"backend"\|"data"\|"tooling"), weight(1..5)` |
| `testimonials.ts` | `testimonials: Testimonial[]` | `id, quote, author, role` |
| `github.ts` | `github: GithubData` | wraps `github.generated.json` → `{username, fetchedAt, repos: Repo[]}` with runtime shape validation |
| `github.generated.json` | (data) | build-time snapshot of public repos |
| `lib/github-stats.ts` | `computeKpis`, `topRepos`, `fetchLiveRepos`, `kpisToCard`, `renderKpiCard`, … | KPI aggregation + **live runtime fetch** of `api.github.com/users/<username>/repos` with snapshot fallback |
| `fs.ts`, `diagnostics.ts` | — | **terminal-emulator-specific — DO NOT PORT** (virtual filesystem + a diagnostics command; irrelevant to the 3D portfolio) |

> Note: your real identity is **Muhammad Hassan Jawwad ("Hassan"), Software Engineer, Pakistan · Remote**, GitHub `@hassanjawwad12`. Four real projects (Task Rise, Sudha, Kassoma AI, Event Management System), four real jobs (Golden Gate Innovations, Datumbrain, Exergy Systems, Texagon), 16 skills, 4 testimonials.

---

## 1. Key architectural decision — keep the data as TypeScript

Your data is **already authored in TypeScript** and `github-stats.ts` imports via the `@/` alias (`@/data/github`). Two options:

- **(A — recommended) Port the `.ts`/`.json` files verbatim** into `src/data/` and `src/lib/`, add an `@` path alias, and let Vite/esbuild transpile them. JSX components import the typed modules with zero interop friction. **Highest fidelity, lowest risk** — we never hand-rewrite your data and risk a typo.
- (B) Convert every data file to plain `.js`. More edits, more chance of drift, loses your types. Rejected.

We go with **(A)**. Vite transpiles `.ts` out of the box (no build config needed); we add a `jsconfig.json` (+ optional `tsconfig.json` + `typescript` devDep) only for editor IntelliSense and the `@/*` path resolution, and the `@` alias in `vite.config.js`.

---

## Decisions locked (2026-05-29)
- **Contact form → `mailto:` to `hassanjawwad01@gmail.com`.** No EmailJS account, no keys. The `@emailjs/browser` dependency, the `.env` EmailJS vars, and the leaked JSM keys are **removed entirely** (the 3D fox + form UI stay; submit builds a `mailto:` with the form fields).
- **Email = CV address `hassanjawwad01@gmail.com`** — this **overrides** the `…12@gmail.com` value in `profile.ts` (the data file is otherwise final; the CV is the correct address).
- **GitHub-stats + Testimonials → appended to the About page.** No new routes, no navbar changes; site stays at 4 pages.
- **Skills/experience → text chips** (group-colored, weight-sized) + text/initials badges. No per-skill icons or company logos sourced.
- **3D scene kept as-is** (island + biplane + bird + fox) for the FE-dev aesthetic — only the copy/data is rewired.
- **Deploy target → Netlify** (not Vercel). SPA routing via `public/_redirects` (`/* /index.html 200`); the existing `vercel.json` is removed.

### Assets in place (provided / created)
- `public/hassan-pic.png` — profile headshot (⚠ 1.3 MB; optimize on build — see Phase 4).
- `public/Muhammad-Hassan-Jawwad.pdf` — CV (wired as a "Download CV" link).
- `src/assets/images/logo-hj.svg` — **HJ monogram, created** (blue→indigo badge, white strokes, font-independent; doubles as favicon).

---

## 2. Data → UI mapping (the rewire blueprint)

| Your data | Drives | Target file |
|---|---|---|
| `profile.name / shortName / role / location` | Hero caption, About heading, Footer copyright, page `<title>` | `HomeInfo.jsx`, `About.jsx`, `Footer.jsx`, `index.html` |
| `profile.tagline` | Hero stage-1 sub-line | `HomeInfo.jsx` |
| `profile.bio` | About intro paragraph | `About.jsx` |
| `profile.availability` | Small status badge ("available / selective / closed") in hero or contact | `HomeInfo.jsx` / `Contact.jsx` |
| `hassanjawwad01@gmail.com` (CV email, overrides `profile.email`) | Contact form target + mailto | `Contact.jsx` |
| `profile.socials[]` | Footer + contact links (GitHub, LinkedIn) | `Footer.jsx`, `Contact.jsx` |
| `skills[]` (label/group/weight) | About "My Skills" — **text chips colored by group, sized by `weight`** (no per-skill icon needed; the data comment literally says weight "drives the chip size") | `About.jsx` |
| `experience[]` | About vertical timeline (title, org, period, summary, highlights[]) | `About.jsx` |
| `projects[]` | Projects grid — text-forward cards (index, title, description, role · year, stack tags, status badge, live + repo links) | `Projects.jsx` |
| `testimonials[]` | **New** testimonials section | `About.jsx` (or new `Testimonials.jsx`) |
| `github` + `github-stats` | **New** live GitHub stats panel (totals, language bars, top repos) | new `GithubStats.jsx` |
| `public/hassan-pic.png` | Headshot/avatar in the About intro | `About.jsx` |
| `public/Muhammad-Hassan-Jawwad.pdf` | "Download CV" button | `About.jsx` + `Contact.jsx` |
| `src/assets/images/logo-hj.svg` | Navbar logo + favicon | `Navbar.jsx` + `index.html` |

---

## 3. Phased task list

### Phase 0 — Safety & toolchain prep
0.1. **Remove leaked secrets + EmailJS (do first).** `.env` currently holds JS Mastery's live EmailJS keys (`service_grmilbt`, `template_fxf1bah`, `a_PC0qz4Qbr_Pn2TA`) and **`.env` is NOT in `.gitignore`** (only `*.local` is). Since Contact is going `mailto:` (decision locked), we drop EmailJS outright:
  - Delete `.env` and uninstall `@emailjs/browser` from `package.json`.
  - Add `.env` and `.env.*` to `.gitignore` anyway (guard against future secrets).
0.2. Add the `@` path alias in `vite.config.js`:
  ```js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import path from 'node:path'

  export default defineConfig({
    plugins: [react()],
    assetsInclude: ['**/*.glb'],
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  })
  ```
0.3. Add `jsconfig.json` (editor resolution of `@/*`):
  ```json
  { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } }, "include": ["src"] }
  ```
0.4. (Optional but recommended) Add `typescript` devDep + a light `tsconfig.json` for type-checking the ported data, and extend the lint script to `--ext js,jsx,ts,tsx`. Skippable for a pure-runtime port.

### Phase 1 — Port the data layer
1.1. Create `src/data/` and copy **verbatim** from your repo: `profile.ts`, `projects.ts`, `experience.ts`, `skills.ts`, `testimonials.ts`, `github.ts`, `github.generated.json`. **One override:** set `profile.email` to `hassanjawwad01@gmail.com` (CV address) instead of the `…12@gmail.com` in the source file.
1.2. Create `src/lib/` and copy `github-stats.ts` verbatim. It already uses `@/data/github`, which now resolves via the alias from 0.2/0.3.
1.3. **Do NOT port** `fs.ts` / `diagnostics.ts` (terminal-only).
1.4. Add a snapshot regenerator so `github.generated.json` can be refreshed (Phase 5 wires it to build): `scripts/generate-github.mjs` — Node fetch of `https://api.github.com/users/hassanjawwad12/repos?per_page=100&sort=updated`, filter `!fork && !private`, map to the `Repo` shape, write `{username, fetchedAt: <ISO>, repos}` to `src/data/github.generated.json`. Add `"gh:snapshot": "node scripts/generate-github.mjs"` to `package.json` scripts.
1.5. Keep `src/constants/index.js` temporarily as a shim, or delete after all imports are migrated (Phase 6). Nothing should import from `constants` once Phase 2–3 land.

### Phase 2 — Rewire existing surfaces to your data
2.1. **`HomeInfo.jsx`** — replace the 4 hardcoded stages with `profile`-driven copy:
  - Stage 1: `Hi, I'm <shortName> 👋 — A <role> from Pakistan 🇵🇰` + `tagline`.
  - Stages 2–4: keep the flow (skills → projects → contact) but neutralize Adrian-specific phrasing. Import `import { profile } from "@/data/profile"`.
2.2. **`About.jsx`**:
  - Heading → `Hello, I'm <name>` (gradient span = `shortName`).
  - Intro paragraph → `profile.bio`.
  - **Skills block** → render `skills` as chips, color by `group`, scale font/padding by `weight` (drop the `block-container`/image-icon markup). Group them under sub-labels (Frontend / Backend / Data / Tooling) or render flat with group-colored chips.
  - **Experience timeline** → map `experience[]` into `VerticalTimelineElement`s: `title`, `org` (+ `orgHref` link), `period` as the date, `summary` paragraph, `highlights[]` as the bullet list. Remove `iconBg`/company-logo icon usage (your data has no logos) — use a group/initial badge or a simple dot.
2.3. **`Projects.jsx`** — replace icon-card markup with text cards from `projects[]`:
  - Show `index` + `title`, `description`, `role · year`, `stack[]` as tag pills, a `status` badge (live / case study / archived), a **Live** link (`href`) and a **Code** link when `repo` exists. Remove `project.iconUrl`/`theme` and the `arrow` icon dependency (or keep arrow as decoration).
2.4. **`Contact.jsx`** — strip EmailJS, keep the 3D fox + form UI:
  - On submit, build `mailto:${profile.email}?subject=...&body=...` from the name/email/message fields and open it (`window.location.href`). Remove the `emailjs` import, the `import.meta.env` vars, and the `to_email: sujata@jsmastery.pro` / `to_name: "JavaScript Mastery"` lines.
  - Add the `profile.availability` badge ("available / selective / closed") here.
2.5. **`Footer.jsx`** — copyright `© <year> <profile.name>`; map `profile.socials[]` (label/href/handle) instead of `constants.socialLinks`. Render text/handle links (your socials have no icon assets) or reuse the existing `github`/`linkedin` SVGs from `assets/icons` keyed by `label`.
2.6. **`Navbar.jsx`** — replace JSM `logo.svg` with the created `@/assets/images/logo-hj.svg` HJ monogram.
2.7. **Headshot + CV** — add `public/hassan-pic.png` as a rounded avatar in the About intro (next to bio), and a "Download CV" button (`<a href="/Muhammad-Hassan-Jawwad.pdf" download>`) on About + Contact.

### Phase 3 — New data-driven sections
3.1. **`GithubStats.jsx`** (new) — consume `computeKpis`, `topRepos`, `fetchLiveRepos` from `@/lib/github-stats`:
  - On mount: `fetchLiveRepos()`; if it returns repos use them, else fall back to the committed `github.repos` snapshot. Track a `live` boolean for a "live · cached" label.
  - Render `computeKpis(repos)`: totals (repos / stars / forks), language distribution as horizontal bars, and `topRepos(6)` as repo cards (name, stars, language, link).
  - **Skip** `renderKpiCard` (it emits terminal ASCII art for the terminal portfolio) and the Go/WASM `CardData`/`isCardData` path — not needed in the visual portfolio. We only use the aggregation + fetch helpers.
  - Mount it on `About.jsx` (e.g. an "Open Source" section) or add a route.
3.2. **Testimonials** — render `testimonials[]` (quote, author, role) as a simple card row/carousel; mount on `About.jsx` above the CTA, or as a new `Testimonials.jsx` + route.
3.3. (Optional) Add `/projects` content depth using `status` to sort/group (live first, archived last).

### Phase 4 — Branding & assets
4.1. `index.html` → `<title>Muhammad Hassan Jawwad | Software Engineer</title>`; set favicon to the HJ monogram (`<link rel="icon" type="image/svg+xml" href="/src/assets/images/logo-hj.svg" />`).
4.1b. **Optimize the headshot** — `public/hassan-pic.png` is ~1.3 MB, far beyond its rendered size (per perf rules). Resize to ≤512px and re-export (e.g. `sips -Z 512 public/hassan-pic.png`, or ship a WebP/AVIF variant). Add explicit `width`/`height` on the `<img>` to avoid CLS.
4.2. `package.json` `name` → `hassan-portfolio`; rewrite `README.md` for your project.
4.3. Remove now-unused assets to keep the bundle lean (Phase 6): company logos (`meta/shopify/starbucks/tesla.png`), JSM `logo.svg`, and project/skill SVG icons that are no longer imported.
4.4. Leave the 3D `.glb` models and `sakura.mp3` untouched (decorative). Optionally swap the Croatia flag emoji → 🇵🇰 (already covered in 2.1).

### Phase 4.5 — SEO & social sharing
> Vite SPAs ship an empty HTML shell, so meta must live in `index.html` (not just React). Tiered by effort/impact.

**Tier 1 — essential, cheap (do this):**
4.5.1. **Static meta in `index.html`** — `<html lang="en">`, `description`, `author`, `theme-color` (`#2563EB`, matches the monogram), and a `<link rel="canonical">`:
  ```html
  <meta name="description" content="Muhammad Hassan Jawwad — Software Engineer building fast, motion-rich interfaces in React, Next.js, and TypeScript." />
  <meta name="author" content="Muhammad Hassan Jawwad" />
  <meta name="theme-color" content="#2563EB" />
  <link rel="canonical" href="https://<your-domain>/" />
  ```
4.5.2. **Open Graph + Twitter Card** in `index.html` (drives link previews on LinkedIn/X/Slack/WhatsApp):
  ```html
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Muhammad Hassan Jawwad | Software Engineer" />
  <meta property="og:description" content="Frontend-focused Software Engineer — React, Next.js, TypeScript." />
  <meta property="og:url" content="https://<your-domain>/" />
  <meta property="og:image" content="https://<your-domain>/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Muhammad Hassan Jawwad | Software Engineer" />
  <meta name="twitter:description" content="Frontend-focused Software Engineer — React, Next.js, TypeScript." />
  <meta name="twitter:image" content="https://<your-domain>/og.png" />
  ```
  > `og:url` / `og:image` **must be absolute URLs** — fill `<your-domain>` once the Vercel domain is known.
4.5.3. **`public/og.png` (1200×630)** — branded share image: HJ monogram + name + role + tagline on the blue→indigo gradient (consistent with the logo). Built as an SVG template then exported to **PNG** (social scrapers don't reliably render SVG). *(I can generate the SVG template on request, same as the monogram.)*
4.5.4. **JSON-LD `Person` schema** in `index.html` (rich-result eligibility) — name, `jobTitle`, `url`, `image` (headshot), `sameAs` (GitHub + LinkedIn from `profile.socials`), `email`.
4.5.5. **`public/robots.txt`** (`User-agent: * / Allow: / / Sitemap: …`) and **`public/sitemap.xml`** listing `/`, `/about`, `/projects`, `/contact`. The Netlify `public/_redirects` rule (Phase 6.5) makes deep links to those routes resolve to `index.html`.

**Tier 2 — optional, nice-to-have:**
4.5.6. **Per-route titles/descriptions** via `react-helmet-async` (e.g. "Projects | Hassan", "About | Hassan"). Keeps each route's tab title and meta distinct. Adds one small dep — skip if staying lean.

**Tier 3 — optional, higher effort (true SSG SEO):**
4.5.7. If crawlable *content* (not just meta) matters, prerender each route to static HTML with **`vite-react-ssg`** so bots get rendered text without executing JS. Requires guarding the 3D/`window` code for the prerender pass. Most portfolios don't need this — modern Googlebot renders JS — but it's the ceiling if SEO becomes a priority.

### Phase 5 — Live GitHub data integration
5.1. **Runtime (primary):** `GithubStats.jsx` calls `fetchLiveRepos()` → live `api.github.com` data on every visit, no token needed (public, unauthenticated; ~60 req/hr/IP — fine for a portfolio). Graceful fallback to snapshot on rate-limit/offline (the helper already returns `null` on failure).
5.2. **Build-time (fallback freshness):** wire `gh:snapshot` into build so the committed snapshot is never stale: `"prebuild": "npm run gh:snapshot"` (or run it in CI / a scheduled GitHub Action committing the JSON). The `github.ts` validator (`assertGithubData`) makes a malformed snapshot fail loudly at load.
5.3. Show provenance in the UI: `fetchedAt` (from snapshot) and a live/cached badge.

### Phase 6 — Cleanup, verify, ship
6.1. Delete `src/constants/index.js` once nothing imports it; prune dead assets (4.3) and their barrel exports in `assets/icons/index.js` / `assets/images/index.js`.
6.2. `npm run lint` clean; `npm run build` green (esbuild transpiles the `.ts` data).
6.3. Manual/visual check at breakpoints **320 / 768 / 1024 / 1440** (per web testing rules): hero, About (skills chips, timeline, github panel, testimonials), Projects, Contact. Verify reduced-motion behavior on the 3D canvas.
6.4. Verify no secrets remain committed; confirm `.env` ignored; confirm EmailJS (or mailto) works end-to-end.
6.5. **Deploy to Netlify:**
  - Add `public/_redirects` with one line: `/* /index.html 200` (SPA rewrite — without it, refreshing `/about` or `/projects` 404s).
  - Delete `vercel.json`.
  - Netlify build settings (UI or a `netlify.toml`): **build command** `npm run build`, **publish directory** `dist`, Node 18+. The npm `prebuild` hook (Phase 5.2) runs the GitHub snapshot automatically before `vite build` on Netlify.
  - *(Optional `netlify.toml`)* add security headers (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`) and long-cache headers for hashed `/assets/*` — see web security rules.
  - After the first deploy, set the real Netlify domain in the SEO absolute URLs (Phase 4.5.1–4.5.2: `og:url`, `og:image`, `canonical`).

---

## 4. File-by-file change summary

| File | Action |
|---|---|
| `vite.config.js` | + `@` alias |
| `jsconfig.json` | **new** — `@/*` paths |
| `tsconfig.json` + `typescript` devDep | **new** (optional, for type-check) |
| `.gitignore` | + `.env`, `.env.*` (keep `!.env.example`) |
| `.env` / `.env.example` | rotate keys → your EmailJS, or remove |
| `src/data/*.ts`, `github.generated.json` | **new** — copied verbatim from your repo (minus `fs.ts`, `diagnostics.ts`) |
| `src/lib/github-stats.ts` | **new** — copied verbatim |
| `scripts/generate-github.mjs` | **new** — snapshot regenerator |
| `package.json` | + `gh:snapshot`/`prebuild` scripts, `name`, lint ext (optional) |
| `src/components/HomeInfo.jsx` | rewrite copy from `profile` |
| `src/pages/About.jsx` | bio + skills chips + experience timeline + (new) github + testimonials |
| `src/pages/Projects.jsx` | text cards from `projects[]` |
| `src/pages/Contact.jsx` | `profile.email`/name, fix EmailJS target |
| `src/components/Footer.jsx` | `profile.socials`, copyright |
| `src/components/Navbar.jsx` | monogram logo |
| `src/components/GithubStats.jsx` | **new** |
| `src/components/Testimonials.jsx` | **new** (or inline in About) |
| `src/components/index.js` | export new components |
| `index.html` | title + favicon + SEO/OG/Twitter meta + JSON-LD `Person` |
| `public/og.png` | **new** — 1200×630 branded share image |
| `public/robots.txt`, `public/sitemap.xml` | **new** — crawl directives + route list |
| `react-helmet-async` (optional) | per-route titles/meta (Tier 2) |
| `public/_redirects` | **new** — Netlify SPA rewrite (`/* /index.html 200`) |
| `netlify.toml` (optional) | Netlify build config + security/cache headers |
| `vercel.json` | **remove** — replaced by Netlify config |
| `src/constants/index.js` | delete after migration |
| unused assets (logos/icons) | prune |

---

## 5. Code sketches for the tricky parts

**Skills chips (About) — weight-driven size, group-driven color:**
```jsx
import { skills } from "@/data/skills";
const groupColor = { frontend: "bg-blue-100 text-blue-700",
  backend: "bg-emerald-100 text-emerald-700",
  data: "bg-purple-100 text-purple-700",
  tooling: "bg-amber-100 text-amber-700" };
const sizeByWeight = (w) => ["text-xs","text-sm","text-base","text-lg","text-xl"][w-1] ?? "text-sm";
// render: skills.map(s => <span className={`${groupColor[s.group]} ${sizeByWeight(s.weight)} rounded-full px-3 py-1`}>{s.label}</span>)
```

**GitHub panel (live + fallback):**
```jsx
import { useEffect, useState } from "react";
import { github } from "@/data/github";
import { fetchLiveRepos, computeKpis, topRepos } from "@/lib/github-stats";

function useRepos() {
  const [repos, setRepos] = useState(github.repos); // snapshot first
  const [live, setLive] = useState(false);
  useEffect(() => {
    let on = true;
    fetchLiveRepos().then(r => { if (on && r) { setRepos(r); setLive(true); } });
    return () => { on = false; };
  }, []);
  return { kpis: computeKpis(repos), top: topRepos(6, repos), live };
}
```

**Experience timeline mapping (About):** swap `constants.experiences` → `experience` and use `period`→date, `summary`→paragraph, `highlights`→bullets, `org`+`orgHref`→linked org name; drop `icon`/`iconBg`.

---

## 6. Inputs — all resolved ✅
| Input | Decision |
|---|---|
| Contact | `mailto:` → `hassanjawwad01@gmail.com` (CV email) |
| New sections | Appended to the About page |
| Skills/experience visuals | Text chips + initials badges |
| Logo / favicon | **HJ monogram created** (`src/assets/images/logo-hj.svg`) |
| Data | Final — port `…/terminal-based-portfolio/src/data` verbatim (email override only) |
| 3D scene | Kept as-is for aesthetics |
| Resume / photo | Provided in `public/` — wired as CV button + About avatar |

**Defaults applied:** `jsconfig.json` only (no `tsconfig`; Vite transpiles `.ts` at build) · snapshot freshness via `prebuild` regeneration + runtime live fetch (no GitHub Action).

Nothing outstanding. The plan is complete and ready to execute when you give the word.

## 7. Acceptance checklist
- [ ] No JSM/Adrian strings remain (`grep -ri "adrian\|jsmastery\|sujata\|croatia"` is clean).
- [ ] All content renders from `src/data/*` — `src/constants/index.js` deleted, nothing imports it.
- [ ] Hero, About (bio/skills/experience/github/testimonials), Projects, Contact, Footer all show **your** data.
- [ ] GitHub panel shows live stats with snapshot fallback + a live/cached badge.
- [ ] `.env` ignored; no committed secrets; Contact delivers to your email.
- [ ] `npm run lint` + `npm run build` pass; visual check at 320/768/1024/1440.
- [ ] Title/favicon/README/package name personalized; deployed.
- [ ] SEO: description/canonical/theme-color set; OG + Twitter tags with **absolute** URLs; `public/og.png` (1200×630) renders correctly in a link-preview validator; JSON-LD `Person` validates; `robots.txt` + `sitemap.xml` reachable; deep links (`/about` etc.) resolve via Netlify `public/_redirects`; `vercel.json` removed.
