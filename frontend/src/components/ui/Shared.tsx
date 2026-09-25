
export function CinematicSurface({ children, className = '', material = 'glass', style = {} }: any) {
  const matClass = material === 'glass' ? 'material-glass' : material === 'acrylic' ? 'material-acrylic' : 'material-crystal';
  return (
    <div className={`${matClass} rounded-2xl p-8 preserve-3d ${className}`} style={style}>
      {children}
    </div>
  );
}

export function StatusIndicator({ status, type = 'dot' }: { status: string, type?: 'dot' | 'label' }) {
  let color = 'bg-cinematic-muted';
  let textColor = 'text-cinematic-muted';
  
  if (['verified', 'completed', 'merged', 'working', 'satisfied', 'active'].includes(status.toLowerCase())) {
    color = 'bg-cinematic-success shadow-[0_0_12px_rgba(73,216,154,0.4)]';
    textColor = 'text-cinematic-success';
  } else if (['pending', 'review', 'partial', 'modification_required', 'pending_verification'].includes(status.toLowerCase())) {
    color = 'bg-cinematic-warning shadow-[0_0_12px_rgba(244,198,106,0.4)]';
    textColor = 'text-cinematic-warning';
  } else if (['not_working', 'overdue', 'not_satisfied', 'missing', 'changes_requested'].includes(status.toLowerCase())) {
    color = 'bg-cinematic-danger shadow-[0_0_12px_rgba(255,111,125,0.4)]';
    textColor = 'text-cinematic-danger';
  }

  if (type === 'dot') {
    return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} title={status} />;
  }

  return (
    <span className={`inline-flex items-center text-[10px] font-bold tracking-[0.1em] uppercase ${textColor}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${color}`} />
      {status.replace('_', ' ')}
    </span>
  );
}
