import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Preload, Text, Environment as DreiEnvironment } from '@react-three/drei';
import * as THREE from 'three';

function CoreObject({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
    const outerRing1 = useRef<THREE.Mesh>(null);
  const outerRing2 = useRef<THREE.Mesh>(null);

  const lenses = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    // Interactive slight tilt for the whole scene
    if (group.current) {
      const targetX = (state.pointer.x * Math.PI) / 15;
      const targetY = (state.pointer.y * Math.PI) / 15;
      group.current.rotation.y += (targetX - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-targetY - group.current.rotation.x) * 0.05;
    }
    
    // Auto-revolve the outer shell and inner lenses
    if (shell.current) shell.current.rotation.y += delta * 0.2;
    if (lenses.current) {
      lenses.current.rotation.y += delta * 0.3;
      lenses.current.rotation.x += delta * 0.1;
    }

    // Auto-revolve the orbit rings
    if (outerRing1.current) outerRing1.current.rotation.z += delta * 0.15;
    if (outerRing2.current) outerRing2.current.rotation.z -= delta * 0.2;
  });

      return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Outer Shell (Simulated Glass without relying on external HDRI) */}
      <Sphere ref={shell} args={[2.5, 64, 64]}>
        <meshPhysicalMaterial 
          color="#A0C0FF"
          transparent
          opacity={0.4}
          roughness={0.0}
          metalness={0.9}
          transmission={0.6}
          ior={1.5}
          thickness={2.5}
          envMapIntensity={3}
        />
      </Sphere>

      {/* Edge Rim Glow for Glass */}
      <Sphere args={[2.55, 64, 64]}>
        <meshBasicMaterial color="#4DA3FF" transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </Sphere>

      {/* Inner Glowing Lenses (Blue, Purple, Pink) */}
      <group ref={lenses}>
        {/* Large Blue lens */}
        <Sphere args={[1.8, 32, 32]} scale={[1, 1, 0.15]} position={[-0.4, 0.4, 0]} rotation={[0, Math.PI / 4, Math.PI / 6]}>
          <meshBasicMaterial color="#0088FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </Sphere>
        {/* Large Purple lens */}
        <Sphere args={[1.6, 32, 32]} scale={[1, 1, 0.2]} position={[0.4, -0.4, 0]} rotation={[0, -Math.PI / 4, -Math.PI / 6]}>
          <meshBasicMaterial color="#9D4EDD" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </Sphere>
        {/* Inner intense core glow */}
        <Sphere args={[1.0, 32, 32]} scale={[1, 1, 1]}>
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>

      {/* Orbit Ring 1 (Cyan/Blue) */}
      <group ref={outerRing1} rotation={[Math.PI / 2.5, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[3.8, 0.015, 16, 100]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        <Sphere args={[0.08, 16, 16]} position={[3.8, 0, 0]}>
          <meshBasicMaterial color="#FFFFFF" />
        </Sphere>
        <Sphere args={[0.25, 16, 16]} position={[3.8, 0, 0]}>
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>

      {/* Orbit Ring 2 (Purple) */}
      <group ref={outerRing2} rotation={[-Math.PI / 3, -Math.PI / 8, 0]}>
        <mesh>
          <torusGeometry args={[3.5, 0.015, 16, 100]} />
          <meshBasicMaterial color="#B026FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        <Sphere args={[0.08, 16, 16]} position={[-3.5, 0, 0]}>
          <meshBasicMaterial color="#FFFFFF" />
        </Sphere>
        <Sphere args={[0.25, 16, 16]} position={[-3.5, 0, 0]}>
          <meshBasicMaterial color="#B026FF" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
      
      {/* Horizontal Orbit Ring */}
      <group rotation={[Math.PI / 2.1, 0, 0]}>
        <mesh>
          <torusGeometry args={[4.2, 0.01, 16, 100]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
        <Sphere args={[0.05, 16, 16]} position={[4.2, 0, 0]}>
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
        </Sphere>
      </group>
      
      {/* 3D Typography */}
      <group position={[0, 0, 0]}>
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
      camera={{ position: [0, 0, 9], fov: 45 }}
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
