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
