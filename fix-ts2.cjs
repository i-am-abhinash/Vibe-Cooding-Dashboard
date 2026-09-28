const fs = require('fs');
let teamDash = fs.readFileSync('frontend/src/pages/TeamDashboard.tsx', 'utf8');

teamDash = teamDash.replace(
  /<div className="text-\[10px\] font-bold text-brand-text-muted">\{pendingReviews\} items need your attention<\/div>/,
  '<div className="text-[10px] font-bold text-brand-text-muted">{dashboard?.openModificationCount || 0} items need your attention</div>'
);

fs.writeFileSync('frontend/src/pages/TeamDashboard.tsx', teamDash);
