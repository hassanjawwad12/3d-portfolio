import { NavLink, useLocation } from "react-router-dom";

import { logoHj } from "../assets/images";
import { profile } from "@/data/profile";
import { useVehicle, VEHICLES } from "../context/VehicleContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const { vehicle, setVehicle, isSpaceshipReady } = useVehicle();

  // The switcher only controls the model in Home's canvas, and only makes sense
  // once the heavier spaceship has finished downloading.
  const showVehicleSwitcher = pathname === "/" && isSpaceshipReady;

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
      <nav className='flex items-center text-lg gap-7 font-medium' aria-label='Main navigation'>
        {showVehicleSwitcher && (
          <label className='flex items-center gap-2 text-sm'>
            <span className='sr-only'>Choose vehicle</span>
            <select
              value={vehicle}
              onChange={(event) => setVehicle(event.target.value)}
              aria-label='Switch the flying vehicle'
              className='cursor-pointer rounded-lg border border-black/15 bg-white/70 px-2 py-1 text-black shadow-sm backdrop-blur transition hover:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
            >
              <option value={VEHICLES.PLANE}>✈️ Biplane</option>
              <option value={VEHICLES.SPACESHIP}>🚀 Spaceship</option>
            </select>
          </label>
        )}
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
