import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { GlassCard, PageHeader } from '../components/ui/Core';
import api from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function GrowthAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  

  useEffect(() => {
    api.get('/members')
      .then(res => {
        // Since we only seeded one month, we will generate historical trends based on their current score for the visual demo
        const members = res.data;
        
        // Generate trend data
        const months = ['Jul', 'Aug', 'Sep', 'Oct'];
        const chartData = months.map((m, i) => {
          let teamAvg = 0;
          let activeCount = 0;
          members.forEach((mem: any) => {
             const base = mem.growth?.individualProjectProgress || 50;
             const variation = (3 - i) * (Math.random() * 10 - 5); // Random historical variance
             teamAvg += Math.max(0, Math.min(100, base - variation));
             if (mem.participation?.active) activeCount++;
          });
          
          return {
            name: m,
            teamCompletionAvg: Math.round(teamAvg / members.length),
            activeParticipants: activeCount - (3 - i) // Slightly fewer in past months
          };
        });
        
        setData(chartData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <AppShell><div className="animate-pulse h-96 material-glass rounded-3xl" /></AppShell>;

  return (
    <AppShell>
      <PageHeader title="Growth Analytics" subtitle="Track historical completion and participation trends across cycles" />

      <div className="grid grid-cols-1 gap-8">
        <GlassCard className="h-[400px]">
          <h3 className="text-white font-bold mb-6">Team Project Completion Rate Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10,15,30,0.9)', borderColor: 'rgba(77,163,255,0.2)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" name="Avg Completion %" dataKey="teamCompletionAvg" stroke="#4da3ff" strokeWidth={3} dot={{r: 4, fill: '#4da3ff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="h-[400px]">
          <h3 className="text-white font-bold mb-6">Active Group Participation Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10,15,30,0.9)', borderColor: 'rgba(168,85,247,0.2)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" name="Active Members" dataKey="activeParticipants" stroke="#a855f7" strokeWidth={3} dot={{r: 4, fill: '#a855f7'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </AppShell>
  );
}
