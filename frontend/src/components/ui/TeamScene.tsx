import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Preload, Text, Cylinder, Environment as DreiEnvironment } from '@react-three/drei';
import * as THREE from 'three';

function CoreObject({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
    const outerRing1 = useRef<THREE.Mesh>(null);
  const outerRing2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    
    const targetX = (state.pointer.x * Math.PI) / 10;
    const targetY = (state.pointer.y * Math.PI) / 10;
    
    group.current.rotation.y += (targetX - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-targetY - group.current.rotation.x) * 0.05;
    
        if (outerRing1.current) outerRing1.current.rotation.z += 0.002;
    if (outerRing2.current) outerRing2.current.rotation.z -= 0.003;
  });

    return (
    <group ref={group} position={[0, 0.5, 0]}>
      {/* Platform / Pedestal */}
      <group position={[0, -3.5, 0]}>
        {/* Base plate */}
        <Cylinder args={[3.2, 3.5, 0.4, 64]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0A0C12" metalness={0.9} roughness={0.3} />
        </Cylinder>
        {/* Mid step */}
        <Cylinder args={[2.8, 3.2, 0.3, 64]} position={[0, 0.35, 0]}>
          <meshStandardMaterial color="#151A28" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {/* Glowing Orange Ring */}
        <Cylinder args={[2.6, 2.6, 0.15, 64]} position={[0, 0.55, 0]}>
          <meshBasicMaterial color="#FF6B00" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        </Cylinder>
        {/* Top platform */}
        <Cylinder args={[2.4, 2.8, 0.3, 64]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#05060A" metalness={0.9} roughness={0.1} />
        </Cylinder>
        {/* Inner glowing core pillar */}
        <Cylinder args={[0.8, 0.8, 1.2, 32]} position={[0, 1.5, 0]}>
          <meshBasicMaterial color="#4DA3FF" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </Cylinder>
      </group>

      {/* Glass Outer Shell */}
      <Sphere ref={shell} args={[2.5, 64, 64]}>
        <meshPhysicalMaterial 
          color="#A0C0FF"
          transparent
          opacity={0.1}
          roughness={0.05}
          metalness={0.2}
          transmission={0.95}
          ior={1.2}
          thickness={1.5}
          envMapIntensity={2.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* Inner Glowing Lenses (Blue & Purple) */}
      <group>
        {/* Blue lens */}
        <Sphere args={[1.6, 32, 32]} scale={[1, 1, 0.2]} position={[-0.5, 0.5, 0]} rotation={[0, Math.PI / 4, Math.PI / 6]}>
          <meshBasicMaterial color="#4DA3FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </Sphere>
        {/* Purple lens */}
        <Sphere args={[1.4, 32, 32]} scale={[1, 1, 0.25]} position={[0.5, -0.3, 0]} rotation={[0, -Math.PI / 4, -Math.PI / 6]}>
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </Sphere>
        {/* Pink lens */}
        <Sphere args={[1.2, 32, 32]} scale={[1, 1, 0.2]} position={[0, 0, 0.8]} rotation={[Math.PI / 4, 0, 0]}>
          <meshBasicMaterial color="#EC4899" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>

      {/* Orbit Ring 1 (Blue) */}
      <group ref={outerRing1} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[3.4, 0.015, 16, 100]} />
          <meshBasicMaterial color="#4DA3FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        <Sphere args={[0.08, 16, 16]} position={[3.4, 0, 0]}>
          <meshBasicMaterial color="#FFFFFF" />
        </Sphere>
        <Sphere args={[0.2, 16, 16]} position={[3.4, 0, 0]}>
          <meshBasicMaterial color="#4DA3FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>

      {/* Orbit Ring 2 (Purple) */}
      <group ref={outerRing2} rotation={[-Math.PI / 4, -Math.PI / 8, 0]}>
        <mesh>
          <torusGeometry args={[3.2, 0.015, 16, 100]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        <Sphere args={[0.08, 16, 16]} position={[-3.2, 0, 0]}>
          <meshBasicMaterial color="#FFFFFF" />
        </Sphere>
        <Sphere args={[0.2, 16, 16]} position={[-3.2, 0, 0]}>
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
      
      {/* Orbit Ring 3 (Horizontal) */}
      <group rotation={[Math.PI / 2.2, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.6, 0.01, 16, 100]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      
      {/* 3D Typography */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        renderOrder={10}
        material-depthTest={false}
      >
        TEAM PROGRESS
      </Text>
      <Text
        position={[0, -0.1, 0]}
        fontSize={0.8}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        renderOrder={10}
        material-depthTest={false}
      >
        {progress}%
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color="#2ED47A"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        renderOrder={10}
        material-depthTest={false}
      >
        +12% this week
      </Text>
    </group>
  );
}

function SceneEnvironment() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#4DA3FF" />
      <directionalLight position={[-5, 5, -5]} intensity={1} color="#8B5CF6" />
      <pointLight position={[0, -2, 2]} intensity={2} distance={10} color="#F5A623" />
      <fog attach="fog" args={['#05060A', 8, 20]} />
    </>
  );
}

export function TeamScene({ progress }: { progress: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 6], fov: 45 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      dpr={[1, 2]}
    >
      <SceneEnvironment />
      <DreiEnvironment preset="city" />
      <CoreObject progress={progress} />
      <Preload all />
    </Canvas>
  );
}
