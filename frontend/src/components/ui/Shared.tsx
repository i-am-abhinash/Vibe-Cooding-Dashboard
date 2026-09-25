import { motion } from 'framer-motion';

export function FluxSurface({ children, className = '', style = {} }: any) {
  return (
    <div className={`flux-panel rounded-xl p-6 preserve-3d ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SpatialNode({ children, onClick, active = false, className = '' }: any) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, z: 20 }}
      whileTap={{ scale: 0.95, z: 0 }}
      className={`relative rounded-full flex items-center justify-center transition-colors preserve-3d
        ${active ? 'bg-flux-accent text-flux-bg shadow-[0_0_20px_rgba(200,255,61,0.4)]' : 'flux-node text-flux-text'}
        ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function StatusIndicator({ status, type = 'dot' }: { status: string, type?: 'dot' | 'label' }) {
  let color = 'bg-flux-muted';
  let textColor = 'text-flux-muted';
  
  if (['verified', 'completed', 'merged', 'working', 'satisfied', 'active'].includes(status.toLowerCase())) {
    color = 'bg-flux-accent shadow-[0_0_10px_rgba(200,255,61,0.5)]';
    textColor = 'text-flux-accent';
  } else if (['pending', 'review', 'partial', 'modification_required', 'pending_verification'].includes(status.toLowerCase())) {
    color = 'bg-flux-accent-warm shadow-[0_0_10px_rgba(255,184,74,0.5)]';
    textColor = 'text-flux-accent-warm';
  } else if (['not_working', 'overdue', 'not_satisfied', 'missing', 'changes_requested'].includes(status.toLowerCase())) {
    color = 'bg-flux-danger shadow-[0_0_10px_rgba(255,92,92,0.5)]';
    textColor = 'text-flux-danger';
  }

  if (type === 'dot') {
    return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} title={status} />;
  }

  return (
    <span className={`inline-flex items-center text-[10px] font-bold tracking-widest uppercase ${textColor}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${color}`} />
      {status.replace('_', ' ')}
    </span>
  );
}
