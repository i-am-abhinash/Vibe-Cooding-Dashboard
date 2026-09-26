const fs = require('fs');

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

dash = dash.replace(
  /\{\/\* RIGHT REGION \*\/\}/,
  `          </div>\n\n          {/* RIGHT REGION */}`
);

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
