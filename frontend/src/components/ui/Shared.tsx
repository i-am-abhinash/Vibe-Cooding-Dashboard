
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className = '', onClick, hoverEffect = false }: GlassCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  let config = { bg: 'bg-surface-elevated', text: 'text-text-muted', label: status };
  
  if (['verified', 'completed', 'merged', 'working', 'satisfied', 'active'].includes(status.toLowerCase())) {
    config = { bg: 'bg-success/10', text: 'text-success', label: status.replace('_', ' ').toUpperCase() };
  } else if (['pending', 'review', 'partial', 'modification_required', 'pending_verification'].includes(status.toLowerCase())) {
    config = { bg: 'bg-warning/10', text: 'text-warning', label: status.replace('_', ' ').toUpperCase() };
  } else if (['not_working', 'overdue', 'not_satisfied', 'missing', 'changes_requested'].includes(status.toLowerCase())) {
    config = { bg: 'bg-danger/10', text: 'text-danger', label: status.replace('_', ' ').toUpperCase() };
  } else {
    config = { bg: 'bg-surface-elevated', text: 'text-text-muted', label: status.replace('_', ' ').toUpperCase() };
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border border-current/20 ${config.bg} ${config.text}`}>
      {['verified', 'completed', 'active'].includes(status.toLowerCase()) && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />}
      {config.label}
    </span>
  );
}
