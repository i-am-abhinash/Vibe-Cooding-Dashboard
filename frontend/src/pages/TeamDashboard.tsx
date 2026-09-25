import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function TeamDashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/team-dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Team Dashboard</h1>
        <button onClick={handleLogout} className="text-gray-500 hover:text-gray-800">Logout</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Active Members</h3>
          <p className="text-2xl font-bold">{data.members.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Pending Reviews</h3>
          <p className="text-2xl font-bold">{data.pendingReviews}</p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Members</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Individual Progress</th>
              <th className="py-2">Group Status</th>
              <th className="py-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {data.members.map((m: any) => (
              <tr key={m.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/team/member/${m.id}`)}>
                <td className="py-2 text-blue-600">{m.name}</td>
                <td className="py-2">{m.projects.filter((p:any) => p.status === 'completed').length} / 4</td>
                <td className="py-2">{m.groupContributions[0]?.status || 'No task'}</td>
                <td className="py-2">
                  {m.attendance.length ? Math.round((m.attendance.filter((a:any) => a.status === 'present').length / m.attendance.length) * 100) : 100}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
