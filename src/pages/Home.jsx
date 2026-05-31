import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import sakura from "../assets/sakura.mp3";
import { HomeInfo, Loader } from "../components";
import { soundoff, soundon } from "../assets/icons";
import {
  Bird,
  Island,
  Plane,
  Sky,
  Spaceship,
  VolcanoIsland,
  VolcanoScenePreloader,
} from "../models";
import { useScene, SCENARIOS } from "../context/SceneContext";

// Fires onReady after the scene has rendered a few frames. Remount it (via key)
// on each scene swap; it lets the "Transitioning…" loader stay through the
// new scene's heavy first frame and hide only once frames are flowing.
const SceneReadyProbe = ({ onReady }) => {
  const frames = useRef(0);
  const done = useRef(false);

  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      done.current = true;
      onReady();
    }
  });

  return null;
};

const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  // Don't buffer the 5 MB track on load — it only plays on click, and an eager
  // preload competes with the 3D model downloads for bandwidth.
  audioRef.current.preload = "none";
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const { scenario, isVolcanoReady, setIsVolcanoReady } = useScene();
  // Defer the volcano scenario download (island + spaceship) until the browser
  // is idle so it never competes with the primary models. Once mounted,
  // VolcanoScenePreloader reports readiness, which reveals the navbar switcher.
  const [startVolcanoPreload, setStartVolcanoPreload] = useState(false);

  // `scenario` is the target the navbar selects; `activeScenario` is what's
  // actually rendered. On a switch we show a "Transitioning…" loader, swap the
  // scene under it, and hide it once the new scene is actually painting.
  const [activeScenario, setActiveScenario] = useState(scenario);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlayingMusic) {
      audio.play();
    }

    return () => {
      audio.pause();
    };
  }, [isPlayingMusic]);

  useEffect(() => {
    const requestIdle =
      window.requestIdleCallback || ((cb) => window.setTimeout(cb, 2000));
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout;

    const handle = requestIdle(() => setStartVolcanoPreload(true));
    return () => cancelIdle(handle);
  }, []);

  useEffect(() => {
    if (scenario === activeScenario) return;

    // Show the loader, let it paint, then swap the scene under it. The loader is
    // hidden by SceneReadyProbe once the new scene is actually painting — not on
    // a timer, because the new scene's first frame (GPU shader compile + texture
    // upload) can block the main thread and starve a timer.
    setIsTransitioning(true);
    const swap = window.setTimeout(() => setActiveScenario(scenario), 150);
    return () => window.clearTimeout(swap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    // If screen width is less than 768px, adjust the scale and position
    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const adjustSpaceshipForScreenSize = () => {
    let screenScale, screenPosition;

    // The spaceship is natively far larger than the biplane, so it needs a much
    // smaller scale to sit comparably in front of the island.
    if (window.innerWidth < 768) {
      screenScale = [0.045, 0.045, 0.045];
      screenPosition = [0.3, -1.3, 0];
    } else {
      screenScale = [0.11, 0.11, 0.11];
      screenPosition = [1.2, -3.6, -4];
    }

    return [screenScale, screenPosition];
  };

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
      screenPosition = [0, -6.5, -43.4];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [0, -6.5, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const adjustVolcanoIslandForScreenSize = () => {
    let screenScale, screenPosition;

    // The volcano model is authored at ~100x scale with huge local offsets, so
    // the whole group needs a tiny scale to sit where the fox island does.
    // Starting values — tuned visually below.
    if (window.innerWidth < 768) {
      screenScale = [0.0028, 0.0028, 0.0028];
      screenPosition = [0, -7, -43.4];
    } else {
      screenScale = [0.0033, 0.0033, 0.0033];
      screenPosition = [0, -8, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();
  const [spaceshipScale, spaceshipPosition] = adjustSpaceshipForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();
  const [volcanoScale, volcanoPosition] = adjustVolcanoIslandForScreenSize();

  const isVolcano = activeScenario === SCENARIOS.VOLCANO;

  return (
    <section className='w-full h-screen relative'>
      <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 5, 10]} intensity={2} />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <hemisphereLight
            skyColor='#b1e1ff'
            groundColor='#000000'
            intensity={1}
          />

          <Bird />
          <Sky isRotating={isRotating} />

          {isVolcano ? (
            <>
              <VolcanoIsland
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                setCurrentStage={setCurrentStage}
                position={volcanoPosition}
                rotation={[0.1, 4.7077, 0]}
                scale={volcanoScale}
              />
              <Spaceship
                isRotating={isRotating}
                position={spaceshipPosition}
                rotation={[0, 20.1, 0]}
                scale={spaceshipScale}
              />
            </>
          ) : (
            <>
              <Island
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                setCurrentStage={setCurrentStage}
                position={islandPosition}
                rotation={[0.1, 4.7077, 0]}
                scale={islandScale}
              />
              <Plane
                isRotating={isRotating}
                position={biplanePosition}
                rotation={[0, 20.1, 0]}
                scale={biplaneScale}
              />
            </>
          )}
        </Suspense>

        {/* Background warm-up for the volcano scenario in its own boundary so the
            download never shows the main Loader or blocks the scene. */}
        {startVolcanoPreload && !isVolcanoReady && (
          <Suspense fallback={null}>
            <VolcanoScenePreloader onReady={() => setIsVolcanoReady(true)} />
          </Suspense>
        )}

        {/* Remounts on each swap; hides the loader once the new scene paints. */}
        <SceneReadyProbe
          key={activeScenario}
          onReady={() => setIsTransitioning(false)}
        />
      </Canvas>

      {/* Scene-switch loader. Covers the canvas while the new scene compiles and
          uploads to the GPU, then SceneReadyProbe hides it. */}
      {isTransitioning && (
        <div className='absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600' />
          <p className='text-base font-medium tracking-wide text-blue-700'>
            Transitioning…
          </p>
        </div>
      )}

      <div className='absolute bottom-2 left-2'>
        <img
          src={!isPlayingMusic ? soundoff : soundon}
          alt='jukebox'
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className='w-10 h-10 cursor-pointer object-contain'
        />
      </div>
    </section>
  );
};

export default Home;
