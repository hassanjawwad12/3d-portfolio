import { CTA } from "../components";
import { projects } from "@/data/projects";

const STATUS_META = {
  live: { label: "Live", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  "case study": { label: "Case study", className: "bg-blue-50 text-blue-700 ring-blue-200" },
  archived: { label: "Archived", className: "bg-slate-100 text-slate-600 ring-slate-200" },
};

// Surface shipped, live work first; archived references last.
const STATUS_ORDER = { live: 0, "case study": 1, archived: 2 };
const sortedProjects = [...projects].sort(
  (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9),
);

const Projects = () => {
  return (
    <section className='max-container'>
      <h1 className='head-text'>
        My{" "}
        <span className='blue-gradient_text drop-shadow font-semibold'>
          Projects
        </span>
      </h1>

      <p className='text-slate-500 mt-2 leading-relaxed max-w-2xl'>
        A selection of the work I hold closest — production apps shipped to real
        customers across agencies, AI products, and backend platforms. Live links
        and source are below where available.
      </p>

      <div className='my-16 grid gap-6 sm:grid-cols-2'>
        {sortedProjects.map((project) => {
          const status = STATUS_META[project.status] ?? STATUS_META.archived;
          return (
            <article
              key={project.id}
              className='group relative flex flex-col rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg'
            >
              <div className='flex items-start justify-between'>
                <span className='font-poppins text-3xl font-bold text-slate-200 transition-colors group-hover:text-blue-300'>
                  {project.index}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              <h2 className='mt-3 font-poppins text-2xl font-semibold text-slate-900'>
                {project.title}
              </h2>
              <p className='mt-1 text-sm font-medium text-slate-400'>
                {project.role} · {project.year}
              </p>

              <p className='mt-3 flex-1 text-slate-500'>{project.description}</p>

              <ul className='mt-5 flex flex-wrap gap-2'>
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className='rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className='mt-6 flex items-center gap-5 font-poppins text-sm font-semibold'>
                <a
                  href={project.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:text-blue-700'
                >
                  {project.status === "case study" ? "View →" : "Live →"}
                </a>
                {project.repo ? (
                  <a
                    href={project.repo}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-slate-500 hover:text-slate-900'
                  >
                    Code ↗
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <hr className='border-slate-200' />

      <CTA />
    </section>
  );
};

export default Projects;
