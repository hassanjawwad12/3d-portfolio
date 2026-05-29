import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { AvailabilityBadge, CTA, GithubStats, Testimonials } from "../components";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";

import "react-vertical-timeline-component/style.min.css";

const CV_PATH = "/Muhammad-Hassan-Jawwad.pdf";
const TIMELINE_GRADIENT = "linear-gradient(135deg, #2563EB, #4F46E5)";

const GROUPS = [
  { key: "frontend", label: "Frontend", chip: "bg-blue-100 text-blue-700" },
  { key: "backend", label: "Backend", chip: "bg-emerald-100 text-emerald-700" },
  { key: "data", label: "Data", chip: "bg-purple-100 text-purple-700" },
  { key: "tooling", label: "Tooling", chip: "bg-amber-100 text-amber-700" },
];

// weight (1..5) drives chip size — bigger weight reads as stronger skill.
const SIZE_BY_WEIGHT = {
  1: "text-xs px-2.5 py-1",
  2: "text-sm px-3 py-1",
  3: "text-sm px-3 py-1.5",
  4: "text-base px-4 py-1.5",
  5: "text-lg px-4 py-2",
};

function initials(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const About = () => {
  return (
    <section className='max-container'>
      <div className='flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center'>
        <div className='flex-1'>
          <h1 className='head-text'>
            Hello, I'm{" "}
            <span className='blue-gradient_text font-semibold drop-shadow'>
              {profile.shortName}
            </span>{" "}
            👋
          </h1>
          <p className='mt-2 font-poppins text-lg font-medium text-slate-500'>
            {profile.role} · {profile.location}
          </p>
          <div className='mt-4'>
            <AvailabilityBadge />
          </div>
          <p className='mt-5 max-w-2xl text-slate-500'>{profile.bio}</p>
          <div className='mt-6 flex flex-wrap items-center gap-4'>
            <a href={CV_PATH} download className='btn !w-auto'>
              Download CV ↓
            </a>
            <a
              href={`mailto:${profile.email}`}
              className='font-semibold text-blue-600 hover:text-blue-700'
            >
              {profile.email}
            </a>
          </div>
        </div>

        <img
          src='/hassan-pic.png'
          alt={profile.name}
          width={320}
          height={320}
          loading='eager'
          className='h-40 w-40 shrink-0 rounded-2xl object-cover shadow-lg ring-4 ring-white sm:h-48 sm:w-48'
        />
      </div>

      <div className='py-12 flex flex-col'>
        <h3 className='subhead-text'>My Skills</h3>

        <div className='mt-8 flex flex-col gap-6'>
          {GROUPS.map((group) => {
            const groupSkills = skills
              .filter((skill) => skill.group === group.key)
              .sort((a, b) => b.weight - a.weight);
            if (groupSkills.length === 0) return null;

            return (
              <div key={group.key}>
                <h4 className='text-sm font-semibold uppercase tracking-wide text-slate-400'>
                  {group.label}
                </h4>
                <div className='mt-3 flex flex-wrap items-center gap-2.5'>
                  {groupSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className={`rounded-full font-medium ${group.chip} ${
                        SIZE_BY_WEIGHT[skill.weight] ?? SIZE_BY_WEIGHT[3]
                      }`}
                    >
                      {skill.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='py-12'>
        <h3 className='subhead-text'>Work Experience.</h3>
        <div className='mt-5 flex flex-col gap-3 text-slate-500'>
          <p className='max-w-2xl'>
            From frontend craft to backend systems — the teams I've shipped real
            products with. Here's the rundown:
          </p>
        </div>

        <div className='mt-12 flex'>
          <VerticalTimeline>
            {experience.map((item) => (
              <VerticalTimelineElement
                key={item.id}
                date={item.period}
                dateClassName='text-slate-500'
                iconStyle={{ background: TIMELINE_GRADIENT, color: "#fff" }}
                icon={
                  <div className='flex h-full w-full items-center justify-center font-poppins font-semibold'>
                    {initials(item.org ?? item.title)}
                  </div>
                }
                contentStyle={{
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: "#2563EB",
                  boxShadow: "none",
                }}
              >
                <div>
                  <h3 className='text-black text-xl font-poppins font-semibold'>
                    {item.title}
                  </h3>
                  {item.org ? (
                    <p className='text-black-500 font-medium text-base' style={{ margin: 0 }}>
                      {item.orgHref ? (
                        <a
                          href={item.orgHref}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:text-blue-700'
                        >
                          {item.org}
                        </a>
                      ) : (
                        item.org
                      )}
                    </p>
                  ) : null}
                </div>

                <p className='mt-3 text-black-500/80 text-sm'>{item.summary}</p>

                <ul className='my-4 list-disc ml-5 space-y-2'>
                  {item.highlights.map((highlight, index) => (
                    <li
                      key={`${item.id}-highlight-${index}`}
                      className='text-black-500/50 font-normal pl-1 text-sm'
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      <div className='py-6'>
        <GithubStats />
      </div>

      <div className='py-12'>
        <Testimonials />
      </div>

      <hr className='border-slate-200' />

      <CTA />
    </section>
  );
};

export default About;
