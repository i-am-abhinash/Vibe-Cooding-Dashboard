const fs = require('fs');

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

// The 4 cards are currently positioned absolutely. Let's find them and wrap them in a flex container.

const cardsRegex = /\{\/\* === FOUR FLOATING PANELS AROUND CENTER === \*\/\}[\s\S]*?\{\/\* === BOTTOM: TEAM MEMBERS STRIP === \*\/\}/;

const newCards = `{/* === FOUR FLOATING PANELS AROUND CENTER === */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 lg:p-4 z-10 pb-[150px]">
              {/* Top Row Cards */}
              <div className="flex justify-between w-full">
                {/* 1. Team Members Panel */}
                <div className="w-[210px] h-[90px] pointer-events-auto glass-panel rounded-[20px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(77,163,255,0.2)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[16px] bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                      <Users size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold leading-none text-white">{members.length}</div>
                      <div className="text-[11px] font-bold text-white tracking-wide">Team Members</div>
                    </div>
                  </div>
                  <div className="absolute bottom-[-16px] left-[20px] glass-panel rounded-full p-1 flex items-center border border-white/20">
                    <div className="flex -space-x-2">
                      {members.slice(0,4).map((m:any, i:number) => (
                        <div key={m.id} className="w-6 h-6 rounded-full border border-[#121621] bg-brand-bg-2 overflow-hidden">
                          <img src={avatarUrls[i % avatarUrls.length]} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="w-6 h-6 ml-2 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer">
                      <ChevronRight size={12} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* 2. Total Projects Panel */}
                <div className="w-[180px] h-[90px] pointer-events-auto glass-panel rounded-[20px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)] mt-8">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[16px] bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                      <FolderKanban size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold leading-none text-white">{totalProjects}</div>
                      <div className="text-[11px] font-bold text-white tracking-wide">Total Projects</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row Cards */}
              <div className="flex justify-between w-full">
                {/* 3. Attendance Panel */}
                <div className="w-[180px] h-[90px] pointer-events-auto glass-panel rounded-[20px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(77,163,255,0.2)] border border-brand-blue/30 mb-8">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-[3px] border-brand-blue/30 flex items-center justify-center relative">
                       <div className="w-8 h-8 rounded-full border-[3px] border-brand-blue border-r-transparent border-t-transparent" style={{ transform: 'rotate(45deg)' }} />
                       <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">98%</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold leading-none text-white">Attendance</div>
                      <div className="text-[10px] text-brand-text-muted mt-1">+2% from last week</div>
                    </div>
                  </div>
                </div>

                {/* 4. Group Project Panel */}
                <div className="w-[180px] h-[90px] pointer-events-auto glass-panel rounded-[20px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-brand-violet/40">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-white to-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      <Globe size={20} className="text-brand-bg-1" />
                    </div>
                    <div>
                      <div className="text-xl font-bold leading-none text-brand-violet-2">Group Project</div>
                      <div className="text-[10px] font-bold text-white mt-1 uppercase tracking-wider">Phase 4 Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* === BOTTOM: TEAM MEMBERS STRIP === */}`;

dash = dash.replace(cardsRegex, newCards);

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
