import React, { useEffect, useState } from 'react';
import Workflow from './pages/Workflow';
import api from './api';
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

function WorkflowEntry({mode,legacy}:{mode:'individual'|'group'|'reviews';legacy:React.ReactNode}){
 const [managed,setManaged]=useState<boolean|null>(null);
 useEffect(()=>{let alive=true;api.get('/workflow').then(r=>{if(alive)setManaged(!!r.data.cycle?.managedWorkflow);}).catch(()=>{if(alive)setManaged(false);});return ()=>{alive=false;};},[]);
 return managed===null?<div className="vibe-state glass-panel">Loading workspace…</div>:managed?<Workflow mode={mode}/>:<>{legacy}</>;
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
          <Route path="/team/projects" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><WorkflowEntry mode="individual" legacy={<ProjectsList />}/></PrivateRoute>} />
          <Route path="/team/group" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><WorkflowEntry mode="group" legacy={<GroupProjectView />}/></PrivateRoute>} />
          <Route path="/team/reviews" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><WorkflowEntry mode="reviews" legacy={<ReviewsInbox />}/></PrivateRoute>} />
          <Route path="/team/growth" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><GrowthAnalytics /></PrivateRoute>} />
          <Route path="/team/reports" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><ReportsExport /></PrivateRoute>} />
          <Route path="/team/settings" element={<PrivateRoute allowedRoles={['team_lead', 'co_lead', 'admin']}><Settings /></PrivateRoute>} />

          
          <Route path="/member/projects" element={<PrivateRoute allowedRoles={['member']}><WorkflowEntry mode="individual" legacy={<ProjectsList />}/></PrivateRoute>} />
          <Route path="/member/group" element={<PrivateRoute allowedRoles={['member']}><WorkflowEntry mode="group" legacy={<GroupProjectView />}/></PrivateRoute>} />
          <Route path="/member/reports" element={<PrivateRoute allowedRoles={['member']}><ReportsExport /></PrivateRoute>} />
          <Route path="/member/growth" element={<PrivateRoute allowedRoles={['member']}><GrowthAnalytics /></PrivateRoute>} />
          <Route path="/member/profile" element={<PrivateRoute allowedRoles={['member']}><Settings /></PrivateRoute>} />

          <Route path="/team/workflow/cycle" element={<PrivateRoute allowedRoles={['team_lead','co_lead']}><Workflow mode="cycle"/></PrivateRoute>}/>
          <Route path="/team/workflow/individual" element={<PrivateRoute allowedRoles={['team_lead','co_lead']}><Workflow mode="individual"/></PrivateRoute>}/>
          <Route path="/team/workflow/group" element={<PrivateRoute allowedRoles={['team_lead','co_lead']}><Workflow mode="group"/></PrivateRoute>}/>
          <Route path="/team/workflow/reviews" element={<PrivateRoute allowedRoles={['team_lead','co_lead']}><Workflow mode="reviews"/></PrivateRoute>}/>
          <Route path="/member/workflow/individual" element={<PrivateRoute allowedRoles={['member']}><Workflow mode="individual"/></PrivateRoute>}/>
          <Route path="/member/workflow/group" element={<PrivateRoute allowedRoles={['member']}><Workflow mode="group"/></PrivateRoute>}/>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
