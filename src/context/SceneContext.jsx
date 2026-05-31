import { createContext, useContext, useMemo, useState } from "react";

/**
 * Shared state for the scene "scenario" shown in the Home canvas.
 *
 * A scenario bundles an island + a vehicle:
 *   - tropical: fox island + biplane (default, ships with the primary assets)
 *   - volcano:  volcano island + spaceship (heavier, loaded in the background)
 *
 * The Navbar (rendered globally in App) switches the scenario and needs to know
 * when the volcano assets have finished downloading, while the models live
 * inside Home's <Canvas>. This context bridges those siblings.
 */

export const SCENARIOS = {
  TROPICAL: "tropical",
  VOLCANO: "volcano",
};

const SceneContext = createContext(null);

export function SceneProvider({ children }) {
  const [scenario, setScenario] = useState(SCENARIOS.TROPICAL);
  // Toggled true by VolcanoScenePreloader once both volcano assets are cached.
  const [isVolcanoReady, setIsVolcanoReady] = useState(false);

  const value = useMemo(
    () => ({ scenario, setScenario, isVolcanoReady, setIsVolcanoReady }),
    [scenario, isVolcanoReady]
  );

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error("useScene must be used within a SceneProvider");
  }
  return context;
}
