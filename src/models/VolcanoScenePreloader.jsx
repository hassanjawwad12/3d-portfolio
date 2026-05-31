import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

import volcanoIslandScene from "../assets/3d/volcano_island.glb";
import spaceshipScene from "../assets/3d/plane2.glb";

/**
 * Invisible loader that warms both assets of the volcano scenario (island +
 * spaceship) into the drei cache and reports once both are available. Mount it
 * inside its own <Suspense fallback={null}> so the download never blocks or
 * flashes the main Loader; once ready, the navbar reveals the scenario switcher.
 */
export function VolcanoScenePreloader({ onReady }) {
  const island = useGLTF(volcanoIslandScene);
  const spaceship = useGLTF(spaceshipScene);

  useEffect(() => {
    if (island.scene && spaceship.scene) onReady();
  }, [island.scene, spaceship.scene, onReady]);

  return null;
}
