import { NavLink, useLocation } from "react-router-dom";

import { logoHj } from "../assets/images";
import { profile } from "@/data/profile";
import { useScene, SCENARIOS } from "../context/SceneContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const { scenario, setScenario, isVolcanoReady } = useScene();

  // The scenario switcher only controls the Home canvas, and only makes sense
  // once the heavier volcano assets (island + spaceship) have downloaded.
  const showScenarioSwitcher = pathname === "/" && isVolcanoReady;

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
        {showScenarioSwitcher && (
          <label className='flex items-center gap-2 text-sm'>
            <span className='sr-only'>Choose scene</span>
            <select
              value={scenario}
              onChange={(event) => setScenario(event.target.value)}
              aria-label='Switch the scene'
              className='cursor-pointer rounded-lg border border-black/15 bg-white/70 px-2 py-1 text-black shadow-sm backdrop-blur transition hover:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40'
            >
              <option value={SCENARIOS.TROPICAL}>🏝️ Tropical</option>
              <option value={SCENARIOS.VOLCANO}>🌋 Volcano</option>
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
