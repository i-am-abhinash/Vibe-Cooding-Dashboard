const fs = require('fs');
let teamDash = fs.readFileSync('frontend/src/pages/TeamDashboard.tsx', 'utf8');

// fix pendingReviews
teamDash = teamDash.replace(
  /\{pendingReviews > 0 && <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">\{pendingReviews\} Action Required<\/span>\}/,
  '{dashboard?.openModificationCount > 0 && <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">{dashboard.openModificationCount} Action Required</span>}'
);

// fix verified being unused (it's in the member map)
teamDash = teamDash.replace(
  /const verified = m\.growth\?\.individualProjectsCompleted \|\| 0;\s*const pct = m\.growth\?\.individualProjectProgress \|\| 0;/g,
  `const pct = m.growth?.individualProjectProgress || 0;`
);

// fix cycle being unused
teamDash = teamDash.replace(
  /const \{ cycle, dashboard \} = data;/,
  `const { dashboard } = data;`
);

fs.writeFileSync('frontend/src/pages/TeamDashboard.tsx', teamDash);

let memberDash = fs.readFileSync('frontend/src/pages/MemberDashboard.tsx', 'utf8');
// remove unused growth
memberDash = memberDash.replace(
  /const growth = dashboard\?\.growth \|\| \{\};/,
  ''
);

fs.writeFileSync('frontend/src/pages/MemberDashboard.tsx', memberDash);
