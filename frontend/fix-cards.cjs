const fs = require('fs');

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

// Pull the camera forward slightly to make the orb bigger, but keep it back enough to prevent clipping. 
// Previously it was [0,0,10], I made it [0,0,13]. Let's try [0,0,10] again, but fix the camera clipping differently.
// Wait, the clipping at [0,0,10] was because of aspect-square clipping it horizontally? 
// No, I'll just change the camera to [0, 0, 9] in TeamScene.tsx.

let scene = fs.readFileSync('src/components/ui/TeamScene.tsx', 'utf8');
scene = scene.replace(
  /camera=\{\{ position: \[[-\d.]+, [-\d.]+, [-\d.]+\], fov: \d+ \}\}/,
  'camera={{ position: [0, 0, 9], fov: 45 }}'
);
fs.writeFileSync('src/components/ui/TeamScene.tsx', scene);

// Now for TeamDashboard.tsx
// Increase pb on the cards container to massively push them away from the bottom member icons
dash = dash.replace(
  /className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 lg:p-12 z-10 pb-\[180px\]"/,
  'className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 lg:p-8 z-10 pb-[280px]"'
);

// Make the orb physically larger to compensate for camera 
dash = dash.replace(
  /className="w-\[clamp\(600px,65vw,900px\)\] aspect-square pointer-events-auto"/,
  'className="w-[clamp(650px,75vw,1000px)] aspect-square pointer-events-auto"'
);

// Adjust the cards so they are spaced nicely
dash = dash.replace(
  /className="flex justify-between w-full"/g,
  'className="flex justify-between w-full px-4 lg:px-12"'
);

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
