import { a } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";

import islandScene from "../assets/3d/island.glb";
import { useIslandControls } from "../hooks/useIslandControls";

export function Island({
  isRotating,
  setIsRotating,
  setCurrentStage,
  ...props
}) {
  const { nodes, materials } = useGLTF(islandScene);
  // Drag / keyboard / touch rotation + stage detection (shared with the volcano
  // island). Uses the default fox-island stage ranges.
  const islandRef = useIslandControls({
    isRotating,
    setIsRotating,
    setCurrentStage,
  });

  return (
    // {Island 3D model from: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907}
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
    </a.group>
  );
}
