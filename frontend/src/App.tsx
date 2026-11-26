import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TeamDashboard from './pages/TeamDashboard';
import MemberDashboard from './pages/MemberDashboard';
import MemberDetail from './pages/MemberDetail';

import MembersList from './pages/MembersList';
import ProjectsList from './pages/ProjectsList';
import GroupProjectView from './pages/GroupProjectView';
import ReviewsInbox from './pages/ReviewsInbox';
import GrowthAnalytics from './pages/GrowthAnalytics';
import ReportsExport from './pages/ReportsExport';
import Settings from './pages/Settings';


function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" />;
  const user = JSON.parse(userStr);
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'member' ? '/member' : '/team'} />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cinematic-bg text-cinematic-text">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/team" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><TeamDashboard /></PrivateRoute>} />
          <Route path="/team/member/:id" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><MemberDetail /></PrivateRoute>} />
          <Route path="/member" element={<PrivateRoute allowedRoles={['member']}><MemberDashboard /></PrivateRoute>} />
          
          <Route path="/team/members" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><MembersList /></PrivateRoute>} />
          <Route path="/team/projects" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><ProjectsList /></PrivateRoute>} />
          <Route path="/team/group" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><GroupProjectView /></PrivateRoute>} />
          <Route path="/team/reviews" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><ReviewsInbox /></PrivateRoute>} />
          <Route path="/team/growth" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><GrowthAnalytics /></PrivateRoute>} />
          <Route path="/team/reports" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><ReportsExport /></PrivateRoute>} />
          <Route path="/team/settings" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><Settings /></PrivateRoute>} />

          
          <Route path="/member/projects" element={<PrivateRoute allowedRoles={['member']}><ProjectsList /></PrivateRoute>} />
          <Route path="/member/group" element={<PrivateRoute allowedRoles={['member']}><GroupProjectView /></PrivateRoute>} />
          <Route path="/member/reports" element={<PrivateRoute allowedRoles={['member']}><ReportsExport /></PrivateRoute>} />
          <Route path="/member/growth" element={<PrivateRoute allowedRoles={['member']}><GrowthAnalytics /></PrivateRoute>} />
          <Route path="/member/profile" element={<PrivateRoute allowedRoles={['member']}><Settings /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
