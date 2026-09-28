import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "material-glass p-6 rounded-3xl preserve-3d border border-white/5 flex flex-col relative overflow-hidden group",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </div>
  )
);
GlassCard.displayName = 'GlassCard';

export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info', className?: string }) => {
  const variants = {
    default: 'bg-cinematic-surface-2 border-cinematic-text/20 text-cinematic-text',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    danger: 'bg-brand-red/10 border-brand-red/20 text-brand-red',
    info: 'bg-brand-blue-2/10 border-brand-blue-2/20 text-brand-blue-2',
  };
  return (
    <span className={cn(`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border`, variants[variant], className)}>
      {children}
    </span>
  );
};

export const PageHeader = ({ title, subtitle, children }: { title: string, subtitle?: string, children?: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{title}</h1>
      {subtitle && <p className="text-cinematic-muted text-sm tracking-wide">{subtitle}</p>}
    </div>
    {children && <div className="flex items-center gap-3">{children}</div>}
  </div>
);
