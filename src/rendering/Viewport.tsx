import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Grid,
} from "@react-three/drei";
import {
  EffectComposer,
  SSAO,
  Bloom,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export function Viewport() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [4, 3, 5], fov: 45, near: 0.05, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <color attach="background" args={["#101013"]} />

      {/* IBL — biggest realism win, drives reflections on worktops/taps */}
      <Environment preset="apartment" background={false} />

      {/* Sun */}
      <directionalLight
        position={[6, 9, 4]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normal-bias={0.04}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-8, 8, 8, -8, 0.1, 30]}
        />
      </directionalLight>

      {/* Fill */}
      <ambientLight intensity={0.15} />

      {/* Placeholder content — replaced in later milestones */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c8ccd1" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2c2c30" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Soft ground contact shadow */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.55}
        scale={20}
        blur={2.5}
        far={6}
        resolution={1024}
      />

      {/* Reference grid — fades with distance */}
      <Grid
        args={[40, 40]}
        cellSize={0.1}
        cellThickness={0.5}
        cellColor="#3a3a40"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#55555f"
        fadeDistance={20}
        fadeStrength={1}
        infiniteGrid
        position={[0, 0.0005, 0]}
      />

      <OrbitControls
        makeDefault
        target={[0, 0.6, 0]}
        maxPolarAngle={Math.PI / 2 - 0.02}
        minDistance={1}
        maxDistance={30}
      />

      <EffectComposer multisampling={0} enableNormalPass>
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={16}
          radius={0.12}
          intensity={18}
          luminanceInfluence={0.6}
          worldDistanceThreshold={1}
          worldDistanceFalloff={0.5}
          worldProximityThreshold={0.5}
          worldProximityFalloff={0.1}
        />
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.2}
          mipmapBlur
        />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
