import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TeamDashboard from './pages/TeamDashboard';
import MemberDashboard from './pages/MemberDashboard';
import MemberDetail from './pages/MemberDetail';

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
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/team" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead']}><TeamDashboard /></PrivateRoute>} />
          <Route path="/team/member/:id" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead']}><MemberDetail /></PrivateRoute>} />
          <Route path="/member" element={<PrivateRoute allowedRoles={['member']}><MemberDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
