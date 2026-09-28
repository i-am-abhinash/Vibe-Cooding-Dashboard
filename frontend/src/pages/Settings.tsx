// import React from 'react';
import AppShell from '../components/layout/AppShell';
import { GlassCard, PageHeader } from '../components/ui/Core';
import { Shield, Clock, HardDrive } from 'lucide-react';

export default function Settings() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

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
              <input type="text" disabled value="September 2026" className="w-full text-white bg-cinematic-surface-2/30 px-3 py-2 rounded border border-white/5 opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-cinematic-muted block mb-1">Status</label>
              <input type="text" disabled value="ACTIVE" className="w-full text-green-400 bg-green-500/10 px-3 py-2 rounded border border-green-500/20 opacity-80 cursor-not-allowed font-bold" />
            </div>
          </div>
          <p className="text-xs text-brand-red italic">Cycle configuration is locked while a cycle is active. Contact System Admin to override.</p>
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
