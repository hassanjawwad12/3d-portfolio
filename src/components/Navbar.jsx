import { NavLink } from "react-router-dom";

import { logoHj } from "../assets/images";
import { profile } from "@/data/profile";

const Navbar = () => {
  return (
    <header className='header'>
      <NavLink to='/' aria-label={`${profile.shortName} — home`}>
        <img
          src={logoHj}
          alt={`${profile.shortName} monogram`}
          width={44}
          height={44}
          className='w-11 h-11 object-contain rounded-xl'
        />
      </NavLink>
      <nav className='flex text-lg gap-7 font-medium' aria-label='Main navigation'>
        <NavLink to='/about' className={({ isActive }) => isActive ? "text-blue-600" : "text-black" }>
          About
        </NavLink>
        <NavLink to='/projects' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
          Projects
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
