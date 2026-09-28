import { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { GlassCard, PageHeader } from '../components/ui/Core';
import api from '../api';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function ReportsExport() {
  const [loading, setLoading] = useState(false);

  const downloadCSV = async (type: string) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (type === 'members') endpoint = '/members';
      if (type === 'projects') endpoint = '/projects';
      
      const res = await api.get(endpoint);
      const data = res.data;
      
      if (!data || data.length === 0) {
        alert('No data available to export');
        setLoading(false);
        return;
      }

      // Flat map data
      const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
      const csvRows = [];
      csvRows.push(headers.join(','));

      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header];
          const escaped = ('' + val).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }

      const blob = new Blob([csvRows.join('\\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch(e) {
      alert('Failed to generate export');
    }
    setLoading(false);
  };

  return (
    <AppShell>
      <PageHeader title="Reports & Data Export" subtitle="Generate operational CSV reports" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <GlassCard className="flex flex-col items-center justify-center p-8 text-center hover:border-cinematic-blue/30 transition-colors">
          <FileSpreadsheet size={48} className="text-cinematic-blue mb-4 opacity-80" />
          <h2 className="text-xl font-bold text-white mb-2">Member Progress Report</h2>
          <p className="text-sm text-cinematic-muted mb-6">Exports all active team members, their attendance rates, modification counts, and project completion status.</p>
          <button 
            onClick={() => downloadCSV('members')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-cinematic-blue text-brand-surface font-bold rounded-lg hover:bg-white transition-colors"
          >
            <Download size={18} /> Download CSV
          </button>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center p-8 text-center hover:border-purple-400/30 transition-colors">
          <FileSpreadsheet size={48} className="text-purple-400 mb-4 opacity-80" />
          <h2 className="text-xl font-bold text-white mb-2">Projects Pipeline Report</h2>
          <p className="text-sm text-cinematic-muted mb-6">Exports all individual projects across the team, including deadlines, current lifecycle status, and domain.</p>
          <button 
            onClick={() => downloadCSV('projects')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-400 transition-colors"
          >
            <Download size={18} /> Download CSV
          </button>
        </GlassCard>

      </div>
    </AppShell>
  );
}
