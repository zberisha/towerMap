import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";

interface TowerSceneProps {
  name: string;
  heightM: number;
  maxHeightM: number;
  sceneAriaLabel: string;
}

function Building({ heightM, maxHeightM }: { heightM: number; maxHeightM: number }) {
  const h = useMemo(() => {
    const t = maxHeightM > 0 ? heightM / maxHeightM : 0.5;
    return 0.35 + t * 3.2;
  }, [heightM, maxHeightM]);

  const width = useMemo(() => 0.45 + (1 - heightM / (maxHeightM || 1)) * 0.12, [heightM, maxHeightM]);

  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, h, width]} />
        <meshStandardMaterial
          color="#5b7cff"
          metalness={0.35}
          roughness={0.45}
          envMapIntensity={0.8}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 48]} />
        <meshStandardMaterial color="#1e293b" metalness={0.1} roughness={0.85} />
      </mesh>
    </group>
  );
}

function SceneContent({ heightM, maxHeightM }: TowerSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[2.8, 2.2, 2.8]} fov={45} />
      <color attach="background" args={["#0b1220"]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[4, 8, 3]}
        intensity={1.15}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#93c5fd" />
      <Suspense fallback={null}>
        <Building heightM={heightM} maxHeightM={maxHeightM} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        target={[0, 1.2, 0]}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </>
  );
}

export function TowerScene(props: TowerSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: 320, borderRadius: 10 }}
      aria-label={props.sceneAriaLabel}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}
