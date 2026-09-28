const fs = require('fs');
let file = fs.readFileSync('src/pages/MemberDashboard.tsx', 'utf8');

file = file.replace(
  /const \{ member, cycle \} = data;/,
  `const { cycle, dashboard } = data;
   const member = dashboard?.profile || {};
   member.projects = dashboard?.projects || [];
   const growth = dashboard?.growth || {};`
);

fs.writeFileSync('src/pages/MemberDashboard.tsx', file);
