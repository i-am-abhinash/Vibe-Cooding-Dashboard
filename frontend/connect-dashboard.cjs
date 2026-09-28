const fs = require('fs');
let file = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

// Replace old data destructuring
file = file.replace(
  /const \{ members, pendingReviews \} = data;\s*let totalProjects = members\.length \* 4;\s*let completedProjects = 0;\s*members\.forEach\(\(m: any\) => \{\s*completedProjects \+= m\.projects\.filter\(\(p:any\) => p\.status === 'completed' \|\| p\.status === 'verified'\)\.length;\s*\}\);\s*const progressPct = totalProjects > 0 \? Math\.round\(\(completedProjects \/ totalProjects\) \* 100\) : 0;/,
  `const { cycle, dashboard } = data;
  const members = dashboard?.membersDetails || [];
  const progressPct = dashboard?.groupProjectProgress || 0;`
);

// Team Members Count Card
file = file.replace(
  /<div className="text-2xl font-bold leading-none text-white">\{members\.length\}<\/div>/g,
  '<div className="text-2xl font-bold leading-none text-white">{dashboard?.teamMemberCount || 0}</div>'
);

// Total Projects Card
file = file.replace(
  /<div className="text-2xl font-bold leading-none text-white">\{totalProjects\}<\/div>/g,
  '<div className="text-2xl font-bold leading-none text-white">{dashboard?.individualProjectsExpected || 0}</div>'
);

// Attendance Card (assuming it had 98%)
file = file.replace(
  /<div className="absolute inset-0 flex items-center justify-center text-\[10px\] font-bold text-white">98%<\/div>/,
  '<div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">{dashboard?.teamAttendance || 0}%</div>'
);

// Group Project Active phase
file = file.replace(
  /<div className="text-\[10px\] font-bold text-white mt-1 uppercase tracking-wider">Phase 4 Active<\/div>/,
  '<div className="text-[10px] font-bold text-white mt-1 uppercase tracking-wider">Phase: {dashboard?.membersDetails[0]?.groupProject?.currentPhase || "DEVELOPMENT"}</div>'
);

// In the Team Members Bottom Strip, mapping members
file = file.replace(
  /const verified = m\.projects\.filter\(\(p:any\) => p\.status === 'completed' \|\| p\.status === 'verified'\)\.length;\s*const pct = Math\.round\(\(verified \/ 4\) \* 100\) \|\| 50;/g,
  `const verified = m.growth?.individualProjectsCompleted || 0;
   const pct = m.growth?.individualProjectProgress || 0;`
);

fs.writeFileSync('src/pages/TeamDashboard.tsx', file);
