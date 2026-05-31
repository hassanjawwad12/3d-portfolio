import { a } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";

import volcanoIslandScene from "../assets/3d/volcano_island.glb";
import { useIslandControls } from "../hooks/useIslandControls";

// Narrow windows spread around the circle (like the fox island) so popups only
// appear at four distinct orientations, with a rotation gap between each — not
// the instant-on-any-nudge behavior of full quarter-turn ranges.
const VOLCANO_STAGE_RANGES = [
  { stage: 1, min: 0.85, max: 1.3 },
  { stage: 2, min: 2.4, max: 2.85 },
  { stage: 3, min: 3.95, max: 4.4 },
  { stage: 4, min: 5.45, max: 5.9 },
];

/**
 * Volcano Island Lowpoly by Animateria — CC-BY-4.0
 * https://sketchfab.com/3d-models/volcano-island-lowpoly-4a6591dc9fee40d8bfda8350683af9af
 *
 * gltfjsx emits ~15 meshes, but we render the whole scene unchanged via
 * <primitive>, wrapped in the rotating group so it shares the island controls.
 */
export function VolcanoIsland({
  isRotating,
  setIsRotating,
  setCurrentStage,
  ...props
}) {
  const { scene } = useGLTF(volcanoIslandScene);
  const islandRef = useIslandControls({
    isRotating,
    setIsRotating,
    setCurrentStage,
    stageRanges: VOLCANO_STAGE_RANGES,
  });

  return (
    <a.group ref={islandRef} {...props}>
      <primitive object={scene} />
    </a.group>
  );
}
