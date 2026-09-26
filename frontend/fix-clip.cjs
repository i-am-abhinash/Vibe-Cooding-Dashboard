const fs = require('fs');

let scene = fs.readFileSync('src/components/ui/TeamScene.tsx', 'utf8');

// Pull camera back to prevent clipping the top and bottom of the orb and its orbital rings
scene = scene.replace(
  /camera=\{\{ position: \[[-\d.]+, [-\d.]+, [-\d.]+\], fov: \d+ \}\}/,
  'camera={{ position: [0, 0, 10], fov: 45 }}'
);

fs.writeFileSync('src/components/ui/TeamScene.tsx', scene);

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

// Increase orb container size to compensate for camera zoom-out
dash = dash.replace(
  /<div className="w-\[clamp\(350px,38vw,500px\)\] aspect-square pointer-events-auto">/,
  '<div className="w-[clamp(500px,50vw,800px)] aspect-square pointer-events-auto">'
);

// Completely remove any negative margins on avatar stacks to guarantee they don't overlap
dash = dash.replace(
  /<div className="flex -space-x-[12]">/g,
  '<div className="flex space-x-2">'
);

// If there are any other flex containers with negative space, fix them
dash = dash.replace(/-space-x-1/g, 'space-x-2');
dash = dash.replace(/-space-x-2/g, 'space-x-2');

// If the user means the 5 bottom avatars are overlapping each other, let's just make sure their container isn't forcing them. 
// justify-between should space them evenly, but if the container is cramped, maybe gap-4 is better than justify-between? 
// No, justify-between is best for spreading across the whole width.

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
