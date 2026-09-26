const fs = require('fs');
let scene = fs.readFileSync('src/components/ui/TeamScene.tsx', 'utf8');

const useFrameRegex = /useFrame\(\(state\) => \{[\s\S]*?\}\);/;
const newUseFrame = `const lenses = useRef<THREE.Group>(null);
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
  });`;

scene = scene.replace(useFrameRegex, newUseFrame);

// Add the lenses ref to the group around the inner lenses
scene = scene.replace(/{?\/\* Inner Glowing Lenses \(Blue, Purple, Pink\) \*\/}?[\r\n\s]*<group>/, '{/* Inner Glowing Lenses (Blue, Purple, Pink) */}\n      <group ref={lenses}>');

// Make the orb more visible
scene = scene.replace(
  /<meshPhysicalMaterial[\s\S]*?thickness=\{1\.5\}[\r\n\s]*\/>/,
  `<meshPhysicalMaterial 
          color="#A0C0FF"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.7}
          transmission={0.8}
          ior={1.3}
          thickness={2.0}
        />`
);

fs.writeFileSync('src/components/ui/TeamScene.tsx', scene);
