import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function MemberDashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  const fetchDashboard = () => api.get('/my-dashboard').then(res => setData(res.data)).catch(console.error);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const createIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    await api.post('/projects/idea', {
      name: target.name.value,
      domain: target.domain.value,
      expectedOutcome: target.expectedOutcome.value,
      cycleId: data.cycle.id
    });
    fetchDashboard();
  };

  const startProject = async (id: string) => {
    await api.post(`/projects/${id}/start`);
    fetchDashboard();
  };

  const submitProject = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const target = e.target as any;
    try {
      await api.post(`/projects/${id}/submit`, { githubUrl: target.githubUrl.value });
      fetchDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error submitting project');
    }
  };

  if (!data) return <div className="p-8">Loading...</div>;

  const { member, cycle } = data;
  const projects = member.projects || [];
  
  // Create empty slots to show exactly 4
  const slots = [0,1,2,3].map(i => projects[i] || null);

  return (
    <div className="p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <button onClick={handleLogout} className="text-gray-500 hover:text-gray-800">Logout</button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Individual Projects (Cycle {cycle.month}/{cycle.year})</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {slots.map((p: any, i) => (
          <div key={i} className="bg-white p-4 rounded shadow border h-64 overflow-y-auto">
            {p ? (
              <>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Status: <span className="font-semibold text-blue-600">{p.status}</span></p>
                <p className="text-sm">Domain: {p.domain}</p>
                <p className="text-sm">Outcome: {p.expectedOutcome}</p>

                {p.status === 'idea_approved' && (
                  <button onClick={() => startProject(p.id)} className="mt-4 bg-blue-500 text-white px-3 py-1 rounded">Start Working</button>
                )}

                {p.status === 'in_progress' && (
                  <form onSubmit={(e) => submitProject(e, p.id)} className="mt-4">
                    <input name="githubUrl" type="url" placeholder="GitHub Repository URL" required className="w-full border p-1 rounded text-sm mb-2" />
                    <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded text-sm">Submit for Verification</button>
                  </form>
                )}
                
                {['pending_verification', 'verified', 'completed'].includes(p.status) && (
                   <div className="mt-4 text-sm">
                      <p>GitHub: <a href={p.githubUrl} target="_blank" className="text-blue-500">{p.githubUrl}</a></p>
                   </div>
                )}
              </>
            ) : (
              <form onSubmit={createIdea} className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="font-bold text-gray-400 mb-2">Empty Slot {i + 1}</h3>
                  <input name="name" placeholder="Project Idea / Name" required className="w-full border p-1 rounded text-sm mb-2" />
                  <input name="domain" placeholder="Domain (e.g. Backend)" required className="w-full border p-1 rounded text-sm mb-2" />
                  <input name="expectedOutcome" placeholder="Expected Outcome" required className="w-full border p-1 rounded text-sm mb-2" />
                </div>
                <button type="submit" className="bg-blue-600 text-white p-1 rounded text-sm">Submit Idea</button>
              </form>
            )}
          </div>
        ))}
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Group Contribution</h2>
      <div className="bg-white p-4 rounded shadow border mb-8">
        {member.groupContributions.length > 0 ? member.groupContributions.map((c: any) => (
          <div key={c.id}>
             <p><strong>Assigned Task:</strong> {c.task}</p>
             <p><strong>Status:</strong> {c.status}</p>
             {c.githubUrl && <p><strong>Submitted URL:</strong> {c.githubUrl}</p>}
             {c.status === 'assigned' && (
                <form className="mt-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  try {
                    await api.post(`/group-contributions/${c.id}/submit`, { githubUrl: target.githubUrl.value });
                    fetchDashboard();
                  } catch (err: any) { alert(err.response?.data?.error); }
                }}>
                  <input name="githubUrl" type="url" placeholder="GitHub PR / Branch URL" required className="w-full border p-1 rounded text-sm mb-2" />
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Submit Contribution</button>
                </form>
             )}
          </div>
        )) : <p className="text-gray-500">No group task assigned yet.</p>}
      </div>

    </div>
  );
}
