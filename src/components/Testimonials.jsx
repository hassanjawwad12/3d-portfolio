import { testimonials } from "@/data/testimonials";

// Author has no avatar asset — derive initials for a typographic badge instead.
function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const Testimonials = () => {
  return (
    <section aria-labelledby='testimonials-heading'>
      <h3 id='testimonials-heading' className='subhead-text'>
        What people say.
      </h3>

      <div className='mt-8 grid gap-6 sm:grid-cols-2'>
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.id}
            className='flex flex-col rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm'
          >
            <span aria-hidden='true' className='font-poppins text-4xl leading-none text-blue-200'>
              &ldquo;
            </span>
            <blockquote className='mt-2 flex-1 text-slate-600'>
              {testimonial.quote}
            </blockquote>
            <figcaption className='mt-5 flex items-center gap-3'>
              <span className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-sm font-semibold text-white'>
                {initials(testimonial.author)}
              </span>
              <span className='flex flex-col'>
                <span className='font-poppins font-semibold text-slate-900'>
                  {testimonial.author}
                </span>
                <span className='text-sm text-slate-400'>{testimonial.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
