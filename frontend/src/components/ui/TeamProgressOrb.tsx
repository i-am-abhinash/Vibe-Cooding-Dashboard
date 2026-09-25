
export function TeamProgressOrb({ percent }: { percent: number }) {
  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      {/* Central Orb */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-blue/30 to-brand-violet/30 blur-[2px] border border-white/20 shadow-[inset_0_0_50px_rgba(255,255,255,0.2)] glow-blue flex flex-col items-center justify-center z-10 backdrop-blur-sm">
        <span className="text-[10px] tracking-[0.2em] uppercase text-brand-text-muted font-bold mb-1">Team Progress</span>
        <span className="text-6xl font-bold tracking-tighter mb-2">{percent}%</span>
        <div className="flex items-center text-xs font-bold text-brand-green">
          <span>+12% this week</span>
        </div>
      </div>
      
      {/* Orbit Rings */}
      <div className="absolute w-[360px] h-[360px] rounded-full border-[1.5px] border-brand-blue/30 border-dashed" style={{ transform: 'rotateX(75deg) rotateY(15deg)', transformStyle: 'preserve-3d' }}>
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-brand-blue rounded-full glow-blue -ml-1.5 -mt-1.5" />
      </div>
      
      <div className="absolute w-[420px] h-[420px] rounded-full border border-brand-violet/20" style={{ transform: 'rotateX(65deg) rotateY(-20deg)', transformStyle: 'preserve-3d' }}>
        <div className="absolute bottom-1/4 right-0 w-2 h-2 bg-brand-violet rounded-full glow-violet -mr-1" />
      </div>

      {/* Pedestal Glow */}
      <div className="absolute -bottom-12 w-[200px] h-[40px] rounded-full bg-brand-gold/20 blur-xl" />
    </div>
  );
}
