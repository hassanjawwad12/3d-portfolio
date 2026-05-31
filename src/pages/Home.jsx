import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import sakura from "../assets/sakura.mp3";
import { HomeInfo, Loader } from "../components";
import { soundoff, soundon } from "../assets/icons";
import { Bird, Island, Plane, Sky, Spaceship, SpaceshipPreloader } from "../models";
import { useVehicle, VEHICLES } from "../context/VehicleContext";

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

  const { vehicle, isSpaceshipReady, setIsSpaceshipReady } = useVehicle();
  // Defer the 20 MB spaceship download until the browser is idle so it never
  // competes with the primary models. Once mounted, SpaceshipPreloader reports
  // readiness, which reveals the navbar switcher.
  const [startSpaceshipPreload, setStartSpaceshipPreload] = useState(false);

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

    const handle = requestIdle(() => setStartSpaceshipPreload(true));
    return () => cancelIdle(handle);
  }, []);

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

  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();
  const [spaceshipScale, spaceshipPosition] = adjustSpaceshipForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();

  const isSpaceshipActive = vehicle === VEHICLES.SPACESHIP;

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
          <Island
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            position={islandPosition}
            rotation={[0.1, 4.7077, 0]}
            scale={islandScale}
          />
          {isSpaceshipActive ? (
            <Spaceship
              isRotating={isRotating}
              position={spaceshipPosition}
              rotation={[0, 20.1, 0]}
              scale={spaceshipScale}
            />
          ) : (
            <Plane
              isRotating={isRotating}
              position={biplanePosition}
              rotation={[0, 20.1, 0]}
              scale={biplaneScale}
            />
          )}
        </Suspense>

        {/* Background warm-up for the spaceship in its own boundary so the 20 MB
            download never shows the main Loader or blocks the scene. */}
        {startSpaceshipPreload && !isSpaceshipReady && (
          <Suspense fallback={null}>
            <SpaceshipPreloader onReady={() => setIsSpaceshipReady(true)} />
          </Suspense>
        )}
      </Canvas>

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
