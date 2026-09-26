const fs = require('fs');
let scene = fs.readFileSync('src/components/ui/TeamScene.tsx', 'utf8');

scene = scene.replace(
  /<meshPhysicalMaterial \n          color="#A0C0FF"\n          transparent\n          opacity=\{0\.25\}\n          roughness=\{0\.05\}\n          metalness=\{0\.7\}\n          transmission=\{0\.8\}\n          ior=\{1\.3\}\n          thickness=\{2\.0\}\n        \/>/,
  `<meshPhysicalMaterial 
          color="#A0C0FF"
          transparent
          opacity={0.4}
          roughness={0.0}
          metalness={0.9}
          transmission={0.6}
          ior={1.5}
          thickness={2.5}
          envMapIntensity={3}
        />`
);

// Increase the edge rim glow
scene = scene.replace(
  /<meshBasicMaterial color="#4DA3FF" transparent opacity=\{0\.1\} blending=\{THREE\.AdditiveBlending\} side=\{THREE\.BackSide\} \/>/,
  `<meshBasicMaterial color="#4DA3FF" transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.BackSide} />`
);

fs.writeFileSync('src/components/ui/TeamScene.tsx', scene);
