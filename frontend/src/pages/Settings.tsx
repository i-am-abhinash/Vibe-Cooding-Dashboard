import { useEffect, useState } from 'react';
import { WorkflowLink } from './Workflow';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { GlassCard, PageHeader } from '../components/ui/Core';
import { Shield, Clock, HardDrive } from 'lucide-react';

export default function Settings() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [cycle,setCycle]=useState<any>(null);
  useEffect(()=>{api.get('/workflow').then(r=>setCycle(r.data.cycle)).catch(()=>{});},[]);
  const canManage=['team_lead','co_lead'].includes(user?.role);
  return (
    <AppShell>
      <PageHeader title="System Settings" subtitle="Configure cycle and operational parameters" />

      <div className="max-w-3xl space-y-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <Shield className="text-cinematic-blue" />
            <h2 className="text-lg font-bold text-white">Identity & Access</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-cinematic-muted block mb-1">Active Profile</label>
              <div className="text-white bg-cinematic-surface-2/30 px-3 py-2 rounded border border-white/5">{user?.name}</div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-cinematic-muted block mb-1">Authorization Level</label>
              <div className="text-white bg-cinematic-surface-2/30 px-3 py-2 rounded border border-white/5">{user?.role}</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <Clock className="text-purple-400" />
            <h2 className="text-lg font-bold text-white">Current Cycle Configuration</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-cinematic-muted block mb-1">Cycle Month</label>
              <input type="text" disabled value={cycle?new Date(cycle.year,cycle.month-1,1).toLocaleDateString("en-US",{month:"long",year:"numeric"}):"No active cycle"} className="w-full text-white bg-cinematic-surface-2/30 px-3 py-2 rounded border border-white/5 opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-cinematic-muted block mb-1">Status</label>
              <input type="text" disabled value={cycle?.status?.toUpperCase()||"INACTIVE"} className="w-full text-green-400 bg-green-500/10 px-3 py-2 rounded border border-green-500/20 opacity-80 cursor-not-allowed font-bold" />
            </div>
          </div>
          {canManage?<div className="space-y-3"><p className="text-xs text-cinematic-muted">Create monthly assignments, manage deadlines and allocate group projects. Previous cycles are retained.</p><WorkflowLink/></div>:<p className="text-xs text-cinematic-muted">Only the team lead can create monthly assignments.</p>}
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <HardDrive className="text-cinematic-text/50" />
            <h2 className="text-lg font-bold text-white">Data Persistence</h2>
          </div>
          <p className="text-sm text-cinematic-muted mb-4">
            Vibe Coding Dashboard operates on a hybrid document-relational graph. Ensure migrations are applied before modifying schema definitions.
          </p>
          <button disabled className="px-4 py-2 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded font-bold text-xs uppercase tracking-wider opacity-50 cursor-not-allowed">
            Wipe Database (Disabled)
          </button>
        </GlassCard>
      </div>
    </AppShell>
  );
}
