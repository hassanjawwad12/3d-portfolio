// Regenerates src/data/github.generated.json — the build-time snapshot of public
// repos that GithubStats falls back to when the live api.github.com fetch fails.
//
// Mapping mirrors fetchLiveRepos() in src/lib/github-stats.ts so the snapshot and
// the live payload share exactly one shape. Run via `npm run gh:snapshot`; wired
// into `prebuild` so deploys never ship a stale snapshot.
//
// Requires Node 18+ (global fetch). Unauthenticated GitHub API: ~60 req/hr/IP.

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const USERNAME = 'hassanjawwad12'
const PER_PAGE = 100

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_PATH = path.resolve(__dirname, '../src/data/github.generated.json')

async function fetchRepos() {
  const url = `https://api.github.com/users/${USERNAME}/repos?per_page=${PER_PAGE}&sort=updated`
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) {
    throw new Error(`GitHub API responded ${res.status} ${res.statusText} for ${url}`)
  }
  const raw = await res.json()
  if (!Array.isArray(raw)) {
    throw new Error('GitHub API did not return an array of repos')
  }
  return raw
    .filter((r) => r && typeof r === 'object')
    .filter((r) => !r.fork && !r.private)
    .map((r) => ({
      name: String(r.name ?? ''),
      description: r.description ?? '',
      language: r.language ?? null,
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      url: String(r.html_url ?? ''),
      updated: String(r.updated_at ?? ''),
      topics: Array.isArray(r.topics) ? r.topics.slice(0, 6) : [],
    }))
    .sort((a, b) => b.stars - a.stars || b.updated.localeCompare(a.updated))
}

async function main() {
  const repos = await fetchRepos()
  const snapshot = {
    username: USERNAME,
    fetchedAt: new Date().toISOString(),
    repos,
  }
  await writeFile(OUT_PATH, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')
  console.log(`Wrote ${repos.length} repos to ${path.relative(process.cwd(), OUT_PATH)}`)
}

// Non-fatal by design: this runs in `prebuild`, and a transient GitHub outage or
// rate-limit must not break a deploy. We keep the committed snapshot (the runtime
// already falls back to it) and exit 0 so `vite build` proceeds.
main().catch((err) => {
  console.warn(
    `gh:snapshot skipped — ${err instanceof Error ? err.message : String(err)}. ` +
      `Keeping the committed src/data/github.generated.json.`,
  )
  process.exit(0)
})
