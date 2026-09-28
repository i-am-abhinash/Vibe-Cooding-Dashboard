const fs = require('fs');

let appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf8');

const imports = `
import MembersList from './pages/MembersList';
import ProjectsList from './pages/ProjectsList';
import GroupProjectView from './pages/GroupProjectView';
import ReviewsInbox from './pages/ReviewsInbox';
import GrowthAnalytics from './pages/GrowthAnalytics';
import ReportsExport from './pages/ReportsExport';
import Settings from './pages/Settings';
`;

appTsx = appTsx.replace(
  /import MemberDetail from '\.\/pages\/MemberDetail';/,
  `import MemberDetail from './pages/MemberDetail';\n${imports}`
);

// We need to replace the wildcard routes with specific routes
const teamRoutes = `
          <Route path="/team/members" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><MembersList /></PrivateRoute>} />
          <Route path="/team/projects" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><ProjectsList /></PrivateRoute>} />
          <Route path="/team/group" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><GroupProjectView /></PrivateRoute>} />
          <Route path="/team/reviews" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><ReviewsInbox /></PrivateRoute>} />
          <Route path="/team/growth" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><GrowthAnalytics /></PrivateRoute>} />
          <Route path="/team/reports" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><ReportsExport /></PrivateRoute>} />
          <Route path="/team/settings" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><Settings /></PrivateRoute>} />
`;

const memberRoutes = `
          <Route path="/member/projects" element={<PrivateRoute allowedRoles={['member']}><ProjectsList /></PrivateRoute>} />
          <Route path="/member/group" element={<PrivateRoute allowedRoles={['member']}><GroupProjectView /></PrivateRoute>} />
          <Route path="/member/reports" element={<PrivateRoute allowedRoles={['member']}><ReportsExport /></PrivateRoute>} />
          <Route path="/member/growth" element={<PrivateRoute allowedRoles={['member']}><GrowthAnalytics /></PrivateRoute>} />
          <Route path="/member/profile" element={<PrivateRoute allowedRoles={['member']}><Settings /></PrivateRoute>} />
`;

// Replace the previous wildcard routing patch I made
appTsx = appTsx.replace(
  /<Route path="\/team\/\*" element=\{<PrivateRoute allowedRoles=\{\['team_lead', 'co_lead', 'admin'\]\}><TeamDashboard \/><\/PrivateRoute>\} \/>/,
  teamRoutes
);

appTsx = appTsx.replace(
  /<Route path="\/member\/\*" element=\{<PrivateRoute allowedRoles=\{\['member'\]\}><MemberDashboard \/><\/PrivateRoute>\} \/>/,
  memberRoutes
);

fs.writeFileSync('frontend/src/App.tsx', appTsx);
