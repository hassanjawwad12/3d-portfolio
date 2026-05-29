import { profile } from "@/data/profile";

// Maps profile.availability onto a labelled, colour-coded status pill.
const META = {
  available: {
    label: "Available for new work",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    ring: "bg-emerald-50 ring-emerald-200",
  },
  selective: {
    label: "Selectively taking work",
    dot: "bg-amber-500",
    text: "text-amber-700",
    ring: "bg-amber-50 ring-amber-200",
  },
  closed: {
    label: "Not currently available",
    dot: "bg-slate-400",
    text: "text-slate-600",
    ring: "bg-slate-50 ring-slate-200",
  },
};

const AvailabilityBadge = ({ className = "" }) => {
  const meta = META[profile.availability] ?? META.selective;

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1 ${meta.ring} ${meta.text} ${className}`}
    >
      <span className={`relative flex h-2 w-2`}>
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${meta.dot} opacity-60 motion-safe:animate-ping`}
        />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${meta.dot}`} />
      </span>
      {meta.label}
    </span>
  );
};

export default AvailabilityBadge;
