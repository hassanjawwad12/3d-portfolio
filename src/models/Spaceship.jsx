import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

import spaceshipScene from "../assets/3d/plane2.glb";

/**
 * 3D Model from: https://sketchfab.com/3d-models/spaceship-eav-2-crab-f4bfa996007e4a6fbd0f31fa807230ce
 * "SPACESHIP EAV 2 CRAB" by Ilya Shevchuk — CC-BY-4.0
 *
 * gltfjsx emits an explicit list of ~50 meshes, but since we render the whole
 * scene unchanged we use the same <primitive> pattern as Plane for brevity.
 * The model has no animations, so `isRotating` is accepted for a consistent
 * vehicle API but intentionally unused.
 */
export function Spaceship({ isRotating, ...props }) {
  const { scene } = useGLTF(spaceshipScene);

  return (
    <mesh {...props}>
      <primitive object={scene} />
    </mesh>
  );
}

/**
 * Invisible loader that warms the spaceship model into the drei cache and
 * reports back once it is available. Mount it inside its own <Suspense
 * fallback={null}> so the 20 MB download never blocks the primary scene.
 */
export function SpaceshipPreloader({ onReady }) {
  const { scene } = useGLTF(spaceshipScene);

  useEffect(() => {
    if (scene) onReady();
  }, [scene, onReady]);

  return null;
}
