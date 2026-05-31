import { createContext, useContext, useMemo, useState } from "react";

/**
 * Shared state for the flyable vehicle shown in the Home canvas.
 *
 * The Navbar (rendered globally in App) needs to switch the vehicle and know
 * when the heavier spaceship model has finished downloading, while the model
 * itself lives inside Home's <Canvas>. This context bridges those siblings.
 */

export const VEHICLES = {
  PLANE: "plane",
  SPACESHIP: "spaceship",
};

const VehicleContext = createContext(null);

export function VehicleProvider({ children }) {
  const [vehicle, setVehicle] = useState(VEHICLES.PLANE);
  // Toggled to true by the SpaceshipPreloader once plane2.glb is in the browser.
  const [isSpaceshipReady, setIsSpaceshipReady] = useState(false);

  const value = useMemo(
    () => ({ vehicle, setVehicle, isSpaceshipReady, setIsSpaceshipReady }),
    [vehicle, isSpaceshipReady]
  );

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
}

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle must be used within a VehicleProvider");
  }
  return context;
}
