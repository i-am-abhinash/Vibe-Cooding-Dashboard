const fs = require('fs');

let scene = fs.readFileSync('src/components/ui/TeamScene.tsx', 'utf8');
scene = scene.replace(
  /camera=\{\{ position: \[[-\d.]+, [-\d.]+, [-\d.]+\], fov: \d+ \}\}/,
  'camera={{ position: [0, 0, 13], fov: 45 }}'
);
fs.writeFileSync('src/components/ui/TeamScene.tsx', scene);

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');
dash = dash.replace(
  /className="w-\[clamp\(500px,50vw,800px\)\] aspect-square pointer-events-auto"/,
  'className="w-[clamp(600px,65vw,900px)] aspect-square pointer-events-auto"'
);
fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
