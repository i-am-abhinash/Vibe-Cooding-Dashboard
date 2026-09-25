const fs = require('fs');
let code = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

// 1. Right panels should use 'physical-glass' class to match sidebar.
// Wait, I should make sure I use `glass-panel` because I updated it in index.css!
// I'll ensure the danger panel uses the standard glass-panel with some red tint inside instead of a solid bg.
code = code.replace(/className="glass-panel-danger p-6 rounded-\[24px\] flex-1 overflow-hidden relative"/, 'className="glass-panel p-6 rounded-[24px] flex-1 overflow-hidden relative"');

// Update attention zone rows to look like subtle internal glass surfaces
code = code.replace(
  /bg-white\/5 border border-white\/5 hover:bg-white\/10 cursor-pointer/g,
  'bg-black/20 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-white/5 cursor-pointer'
);

// 2. Project Timeline
// Replace the simple SVG path with a layered organic curve
const projectTimelineRegex = /<svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">[\s\S]*?<\/svg>/;
const newTimelineSvg = `<svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="drop-shadow-[0_0_15px_rgba(77,163,255,0.3)]">
                  <defs>
                    <linearGradient id="timelineArea1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4DA3FF" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0"/>
                    </linearGradient>
                    <linearGradient id="timelineArea2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#1E1A33" stopOpacity="0.0"/>
                    </linearGradient>
                    <linearGradient id="timelineLine1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4DA3FF" stopOpacity="0.8"/>
                      <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#4DA3FF" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                  <!-- Background subtle mountain layer -->
                  <path d="M0,80 Q50,60 100,75 T220,50 T330,70 T400,60 L400,100 L0,100 Z" fill="url(#timelineArea2)" opacity="0.6" />
                  
                  <!-- Foreground dynamic wave -->
                  <path d="M0,60 Q80,20 150,50 T280,30 T400,45 L400,100 L0,100 Z" fill="url(#timelineArea1)" opacity="0.8" />
                  <path d="M0,60 Q80,20 150,50 T280,30 T400,45" fill="none" stroke="url(#timelineLine1)" strokeWidth="2.5" />
                  
                  <!-- Today vertical line -->
                  <line x1="280" y1="10" x2="280" y2="100" stroke="#4DA3FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                  <!-- Glowing points -->
                  <circle cx="150" cy="50" r="4" fill="#8B5CF6" stroke="#fff" strokeWidth="1.5" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  <circle cx="280" cy="30" r="5" fill="#4DA3FF" stroke="#fff" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(77,163,255,1)]" />
                </svg>`;
code = code.replace(projectTimelineRegex, newTimelineSvg);

// 3. Team Activity
// Replace the single AreaChart area with two layered ones
const areaChartRegex = /<Area type="monotone" dataKey="value" stroke="url\(#actLine\)" strokeWidth=\{3\} fillOpacity=\{1\} fill="url\(#actArea\)" \/>/;
const newAreaChart = `
                    <defs>
                      <linearGradient id="actArea1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4DA3FF" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="#4DA3FF" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="actArea2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#actArea2)" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
                    <Area type="monotone" dataKey="value" stroke="#4DA3FF" strokeWidth={2} fillOpacity={1} fill="url(#actArea1)" className="drop-shadow-[0_0_10px_rgba(77,163,255,0.5)]" />
`;
code = code.replace(/<defs>[\s\S]*?<\/defs>\s*<Area type="monotone" dataKey="value" stroke="url\(#actLine\)" strokeWidth=\{3\} fillOpacity=\{1\} fill="url\(#actArea\)" \/>/, newAreaChart);

fs.writeFileSync('src/pages/TeamDashboard.tsx', code);
