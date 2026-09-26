const fs = require('fs');

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

dash = dash.replace(
  /<div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 lg:p-4 z-10 pb-\[150px\]">/,
  '<div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 lg:p-12 z-10 pb-[180px]">'
);

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
