import { github, linkedin } from "../assets/icons";
import { profile } from "@/data/profile";

// profile.socials carries no icon assets, so map by label onto the SVGs we ship.
const iconByLabel = {
  GitHub: github,
  LinkedIn: linkedin,
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='footer font-poppins'>
      <hr className='border-slate-200' />

      <div className='footer-container'>
        <p>
          © {year} <strong>{profile.name}</strong>. All rights reserved.
        </p>

        <div className='flex gap-3 justify-center items-center'>
          {profile.socials.map((social) => {
            const icon = iconByLabel[social.label];
            return (
              <a
                key={social.label}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`${social.label} — ${social.handle}`}
                className='flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors'
              >
                {icon ? (
                  <img src={icon} alt='' aria-hidden='true' className='w-6 h-6 object-contain' />
                ) : null}
                <span className='text-sm hidden sm:inline'>{social.handle}</span>
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
