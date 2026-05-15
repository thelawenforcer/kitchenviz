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
import { BlendFunction, SMAAPreset } from "postprocessing";
import * as THREE from "three";
import { useScene } from "@/scene/store";
import { mmToM } from "@/types";
import { useRenderMode } from "@/ui/renderMode";
import { ItemRenderer } from "./ItemRenderer";
import { Selection } from "./Selection";
import { HighQualityCapture } from "./HighQualityCapture";

export function Viewport() {
  const items = useScene((s) => s.scene.items);
  const lighting = useScene((s) => s.scene.lighting);
  const camera = useScene((s) => s.scene.camera);
  const select = useScene((s) => s.select);
  const hq = useRenderMode((s) => s.active);

  const [az, el] = lighting.sunAngle;
  const sunR = 12;
  const sunPos: [number, number, number] = [
    Math.cos(el) * Math.sin(az) * sunR,
    Math.sin(el) * sunR,
    Math.cos(el) * Math.cos(az) * sunR,
  ];

  const shadowMap = hq ? 4096 : 2048;
  const ssaoSamples = hq ? 32 : 16;
  const dpr: [number, number] = hq ? [2, 2] : [1, 2];

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{
        position: [mmToM(camera.position[0]), mmToM(camera.position[1]), mmToM(camera.position[2])],
        fov: 45,
        near: 0.05,
        far: 200,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        outputColorSpace: THREE.SRGBColorSpace,
        preserveDrawingBuffer: true, // required for canvas.toDataURL
      }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={["#101013"]} />

      <Environment
        preset={lighting.environmentPreset}
        environmentIntensity={lighting.environmentIntensity}
        background={false}
      />

      <directionalLight
        position={sunPos}
        intensity={lighting.sunIntensity}
        castShadow
        shadow-mapSize={[shadowMap, shadowMap]}
        shadow-bias={-0.0002}
        shadow-normal-bias={0.04}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-8, 8, 8, -8, 0.1, 40]}
        />
      </directionalLight>

      <ambientLight intensity={lighting.ambientIntensity} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2c2c30" roughness={0.85} metalness={0.0} />
      </mesh>

      {items.map((item) => (
        <ItemRenderer
          key={item.id}
          item={item}
          onPointerDown={(e) => {
            e.stopPropagation();
            select(item.id);
          }}
        />
      ))}

      <Selection />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.5}
        scale={20}
        blur={2.5}
        far={6}
        resolution={hq ? 2048 : 1024}
      />

      {!hq && (
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
      )}

      <OrbitControls
        makeDefault
        target={[mmToM(camera.target[0]), mmToM(camera.target[1]), mmToM(camera.target[2])]}
        maxPolarAngle={Math.PI / 2 - 0.02}
        minDistance={0.5}
        maxDistance={30}
      />

      <EffectComposer multisampling={hq ? 8 : 0} enableNormalPass>
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={ssaoSamples}
          radius={0.12}
          intensity={hq ? 22 : 18}
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
        <SMAA preset={hq ? SMAAPreset.ULTRA : SMAAPreset.MEDIUM} />
      </EffectComposer>

      <HighQualityCapture />
    </Canvas>
  );
}
