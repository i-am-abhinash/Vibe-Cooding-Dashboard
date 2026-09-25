import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [riskReasons, setRiskReasons] = useState<string[]>([]);

  useEffect(() => {
    api.get(`/members/${id}`).then(res => setMember(res.data)).catch(console.error);
    api.get(`/members/${id}/risk`).then(res => setRiskReasons(res.data.riskReasons)).catch(console.error);
  }, [id]);

  const verifyIdea = async (projectId: string, status: string) => {
    await api.post(`/projects/${projectId}/review-idea`, { status, comments: '' });
    window.location.reload();
  };

  const verifyProject = async (projectId: string, action: string) => {
    await api.post(`/projects/${projectId}/verify`, { action, comments: 'Verified by Lead' });
    window.location.reload();
  };

  if (!member) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="mb-4">
        <Link to="/team" className="text-blue-600">&larr; Back to Dashboard</Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">{member.name}'s Profile</h1>

      {riskReasons.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <strong className="font-bold">At Risk Flags: </strong>
          <ul className="list-disc pl-5 mt-2">
            {riskReasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Individual Projects</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {member.projects.map((p: any) => (
          <div key={p.id} className="bg-white p-4 rounded shadow border">
            <h3 className="font-bold">{p.name || 'Unnamed Project'}</h3>
            <p className="text-sm text-gray-600">Status: {p.status}</p>
            {p.ideaStatus === 'submitted' && (
              <div className="mt-2 space-x-2">
                <button onClick={() => verifyIdea(p.id, 'idea_approved')} className="bg-green-500 text-white px-2 py-1 rounded text-sm">Approve Idea</button>
                <button onClick={() => verifyIdea(p.id, 'changes_requested')} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Reject Idea</button>
              </div>
            )}
            {p.status === 'pending_verification' && (
              <div className="mt-2 space-x-2">
                <p>GitHub: <a href={p.githubUrl} target="_blank" className="text-blue-500">{p.githubUrl}</a></p>
                <button onClick={() => verifyProject(p.id, 'verify')} className="bg-green-500 text-white px-2 py-1 rounded text-sm">Verify</button>
                <button onClick={() => verifyProject(p.id, 'request_modification')} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Request Mods</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Group Contribution</h2>
      {member.groupContributions.map((c: any) => (
        <div key={c.id} className="bg-white p-4 rounded shadow mb-4">
          <p><strong>Task:</strong> {c.task}</p>
          <p><strong>Status:</strong> {c.status}</p>
          {c.githubUrl && <p><strong>GitHub:</strong> <a href={c.githubUrl} target="_blank" className="text-blue-500">{c.githubUrl}</a></p>}
        </div>
      ))}
    </div>
  );
}
