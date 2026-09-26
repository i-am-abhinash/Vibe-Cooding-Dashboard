const fs = require('fs');

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

dash = dash.replace(
  /<div className="flex -space-x-2">/g,
  '<div className="flex -space-x-1">'
);

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
