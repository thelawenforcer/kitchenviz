import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export function Viewport() {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 3, 5], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <mesh
        position={[0, 0.5, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#9aa0a6" />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2a2e" />
      </mesh>

      <OrbitControls makeDefault target={[0, 0.5, 0]} />
    </Canvas>
  );
}
