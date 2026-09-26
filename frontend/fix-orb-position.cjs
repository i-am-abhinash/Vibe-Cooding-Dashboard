const fs = require('fs');

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

dash = dash.replace(
  /<div className="absolute inset-0 flex items-center justify-center">[\r\n\s]*<div className="w-\[clamp\(350px,40vw,550px\)\] aspect-square pointer-events-auto">/,
  `<div className="absolute inset-0 flex items-center justify-center pb-[120px]">
                <div className="w-[clamp(350px,38vw,500px)] aspect-square pointer-events-auto">`
);

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
