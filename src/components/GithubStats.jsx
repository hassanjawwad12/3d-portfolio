import { useEffect, useState } from "react";

import { github } from "@/data/github";
import { computeKpis, fetchLiveRepos, topRepos } from "@/lib/github-stats";

const TOP_N = 6;

// Snapshot-first, then upgrade to live api.github.com data when the unauthenticated
// fetch succeeds. Falls back silently to the committed snapshot on rate-limit/offline.
function useRepos() {
  const [repos, setRepos] = useState(github.repos);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let active = true;
    fetchLiveRepos().then((fresh) => {
      if (active && fresh && fresh.length > 0) {
        setRepos(fresh);
        setLive(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { kpis: computeKpis(repos), top: topRepos(TOP_N, repos), live };
}

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const Stat = ({ value, label }) => (
  <div className='flex flex-col'>
    <span className='font-poppins text-3xl font-bold text-slate-900 sm:text-4xl'>
      {value}
    </span>
    <span className='text-sm font-medium text-slate-400'>{label}</span>
  </div>
);

const GithubStats = () => {
  const { kpis, top, live } = useRepos();
  const snapshotDate = formatDate(kpis.fetchedAt);
  const maxLang = kpis.languages[0]?.count ?? 1;

  return (
    <section
      aria-labelledby='open-source-heading'
      className='rounded-3xl border border-slate-200 bg-white/70 p-6 sm:p-8'
    >
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h3 id='open-source-heading' className='subhead-text'>
            Open Source
          </h3>
          <a
            href={`https://github.com/${kpis.username}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm font-medium text-blue-600 hover:text-blue-700'
          >
            github.com/{kpis.username}
          </a>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            live
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-slate-100 text-slate-600 ring-slate-200"
          }`}
          title={
            live
              ? "Fetched live from the GitHub API"
              : snapshotDate
                ? `Cached snapshot from ${snapshotDate}`
                : "Cached snapshot"
          }
        >
          <span
            className={`h-2 w-2 rounded-full ${live ? "bg-emerald-500" : "bg-slate-400"}`}
          />
          {live ? "Live" : snapshotDate ? `Cached · ${snapshotDate}` : "Cached"}
        </span>
      </div>

      <div className='mt-6 grid grid-cols-3 gap-4'>
        <Stat value={kpis.totalRepos} label='Public repos' />
        <Stat value={kpis.totalStars} label='Stars' />
        <Stat value={kpis.totalForks} label='Forks' />
      </div>

      {kpis.languages.length > 0 ? (
        <div className='mt-8'>
          <h4 className='text-sm font-semibold uppercase tracking-wide text-slate-400'>
            Languages
          </h4>
          <ul className='mt-3 flex flex-col gap-2.5'>
            {kpis.languages.slice(0, 6).map((lang) => (
              <li key={lang.lang} className='flex items-center gap-3'>
                <span className='w-28 shrink-0 text-sm font-medium text-slate-600'>
                  {lang.lang}
                </span>
                <span className='h-2 flex-1 overflow-hidden rounded-full bg-slate-100'>
                  <span
                    className='block h-full rounded-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff]'
                    style={{ width: `${Math.max(6, (lang.count / maxLang) * 100)}%` }}
                  />
                </span>
                <span className='w-6 shrink-0 text-right text-sm tabular-nums text-slate-400'>
                  {lang.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {top.length > 0 ? (
        <div className='mt-8'>
          <h4 className='text-sm font-semibold uppercase tracking-wide text-slate-400'>
            Top repositories
          </h4>
          <div className='mt-3 grid gap-3 sm:grid-cols-2'>
            {top.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target='_blank'
                rel='noopener noreferrer'
                className='group flex min-w-0 flex-col rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/40'
              >
                <div className='flex min-w-0 items-center justify-between gap-2'>
                  <span className='min-w-0 truncate font-poppins font-semibold text-slate-800 group-hover:text-blue-700'>
                    {repo.name}
                  </span>
                  <span className='shrink-0 text-sm text-slate-400'>
                    ★ {repo.stars}
                  </span>
                </div>
                {repo.description ? (
                  <p className='mt-1 line-clamp-2 text-sm text-slate-500'>
                    {repo.description}
                  </p>
                ) : null}
                {repo.language ? (
                  <span className='mt-3 w-fit rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'>
                    {repo.language}
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default GithubStats;
