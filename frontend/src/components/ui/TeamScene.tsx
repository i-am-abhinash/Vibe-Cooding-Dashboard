import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Preload, Text, Cylinder } from '@react-three/drei';
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
        <Cylinder args={[3, 3.5, 0.2, 64]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0A0C12" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[2.5, 3, 0.3, 64]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#121621" metalness={0.6} roughness={0.4} />
        </Cylinder>
        {/* Glowing ring on pedestal */}
        <Cylinder args={[2.4, 2.4, 0.35, 64]} position={[0, 0.25, 0]}>
          <meshBasicMaterial color="#F5A623" transparent opacity={0.8} />
        </Cylinder>
        <Cylinder args={[2, 2.5, 0.2, 64]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#05060A" metalness={0.9} roughness={0.1} />
        </Cylinder>
        {/* Connection pillar */}
        <Cylinder args={[0.5, 0.8, 1, 32]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#121621" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </group>

      {/* Central Inner Core */}
      <Sphere args={[1.5, 64, 64]}>
        <meshPhysicalMaterial 
          color="#05060A"
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* Glass Outer Shell */}
      <Sphere ref={shell} args={[2.2, 64, 64]}>
        <meshPhysicalMaterial 
          color="#4DA3FF"
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
          ior={1.5}
          thickness={0.5}
          envMapIntensity={2}
          clearcoat={1}
        />
      </Sphere>

      {/* Atmospheric Inner Glow */}
      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </Sphere>

      {/* Orbit Ring 1 */}
      <group ref={outerRing1} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[3, 0.01, 16, 100]} />
          <meshBasicMaterial color="#4DA3FF" transparent opacity={0.4} />
        </mesh>
        <Sphere args={[0.1, 16, 16]} position={[3, 0, 0]}>
          <meshBasicMaterial color="#4DA3FF" />
        </Sphere>
      </group>

      {/* Orbit Ring 2 */}
      <group ref={outerRing2} rotation={[-Math.PI / 4, -Math.PI / 8, 0]}>
        <mesh>
          <torusGeometry args={[2.8, 0.01, 16, 100]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
        </mesh>
        <Sphere args={[0.1, 16, 16]} position={[-2.8, 0, 0]}>
          <meshBasicMaterial color="#8B5CF6" />
        </Sphere>
      </group>
      
      {/* 3D Typography */}
      <Text
        position={[0, 0.4, 2.3]}
        fontSize={0.12}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        TEAM PROGRESS
      </Text>
      <Text
        position={[0, 0, 2.3]}
        fontSize={0.45}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        {progress}%
      </Text>
      <Text
        position={[0, -0.4, 2.3]}
        fontSize={0.1}
        color="#2ED47A"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        +12% this week
      </Text>
    </group>
  );
}

function Environment() {
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
      <Environment />
      <CoreObject progress={progress} />
      <Preload all />
    </Canvas>
  );
}
