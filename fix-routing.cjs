const fs = require('fs');

let appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf8');

// Replace the fallback route
appTsx = appTsx.replace(
  /<Route path="\*" element=\{<Navigate to="\/login" \/>\} \/>/,
  `<Route path="/team/*" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><TeamDashboard /></PrivateRoute>} />
          <Route path="/member/*" element={<PrivateRoute allowedRoles={['member']}><MemberDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />`
);

// Add admin to PrivateRoute allowed roles just in case
appTsx = appTsx.replace(
  /<PrivateRoute allowedRoles=\{!\[\'team_lead\', \'co_lead\'\]/g,
  `<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}`
);

fs.writeFileSync('frontend/src/App.tsx', appTsx);
