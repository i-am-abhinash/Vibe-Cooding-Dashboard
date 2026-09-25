const fs = require('fs');

// --- 1. Fix index.css (Dark background, correct global glass material) ---
let css = fs.readFileSync('src/index.css', 'utf8');

// Ensure root/body has dark background explicitly
css = css.replace(/body \{[\s\S]*?\}/, `body {
    background-color: #05060A !important;
    color: #FFFFFF;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    overflow: hidden;
    margin: 0;
    width: 100vw;
    height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  html { background-color: #05060A; width: 100%; height: 100%; margin: 0; }
  #root { width: 100%; height: 100%; background-color: #05060A; }`);

// Add the environmental lighting to exact-container
css = css.replace(/\.exact-container \{[\s\S]*?\}/, `.exact-container {
    width: 1536px;
    height: 1024px;
    position: relative;
    /* Dark atmospheric environment */
    background: #05060A;
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(30, 45, 90, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(50, 20, 80, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(20, 25, 40, 0.2) 0%, transparent 60%);
  }`);

// Update .glass-panel to be truly translucent physical glass
css = css.replace(/\.glass-panel \{[\s\S]*?\}/, `.glass-panel {
    background: rgba(8, 12, 24, 0.42);
    backdrop-filter: blur(18px) saturate(125%);
    -webkit-backdrop-filter: blur(18px) saturate(125%);
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    border-left: 1px solid rgba(150, 180, 255, 0.16);
    border-right: 1px solid rgba(139, 92, 246, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 50px rgba(0,0,0,0.35);
  }`);

// Make danger panel a tinted glass, not opaque red
css = css.replace(/\.glass-panel-danger \{[\s\S]*?\}/, `.glass-panel-danger {
    background: rgba(40, 15, 20, 0.42);
    backdrop-filter: blur(18px) saturate(125%);
    -webkit-backdrop-filter: blur(18px) saturate(125%);
    border-top: 1px solid rgba(239, 68, 68, 0.3);
    border-left: 1px solid rgba(239, 68, 68, 0.2);
    border-right: 1px solid rgba(239, 68, 68, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 1px 0 rgba(239, 68, 68, 0.2), 0 20px 50px rgba(0,0,0,0.35);
  }`);

fs.writeFileSync('src/index.css', css);

// --- 2. Fix AppShell.tsx (Parallax, Sidebar Z-Index, Colors) ---
let shell = fs.readFileSync('src/components/layout/AppShell.tsx', 'utf8');

// Disable parallax
shell = shell.replace(/style={{ transform: `translate\([^}]+\)` }}/g, '');
shell = shell.replace(/style={{ transform: `translate\([^}]+\)` }}/g, ''); // in case some missed
shell = shell.replace(/style={{ transform: `translate\([^}]+\)` }}/g, ''); 

// Ensure sidebar is strictly absolute and z-[100]
shell = shell.replace(/<aside \s*className="absolute left-\[13px\] top-\[12px\] bottom-\[23px\] w-\[114px\] rounded-\[34px\] flex flex-col items-center py-8 z-\[100\] transition-transform duration-100 ease-out"/, 
  '<aside \n          className="absolute left-[13px] top-[12px] bottom-[23px] w-[114px] rounded-[34px] flex flex-col items-center py-8 z-[100]"');
shell = shell.replace(/<aside \s*className="absolute left-\[13px\] top-\[12px\] bottom-\[23px\] w-\[114px\] rounded-\[34px\] flex flex-col items-center py-8 z-50 transition-transform duration-100 ease-out"/, 
  '<aside \n          className="absolute left-[13px] top-[12px] bottom-[23px] w-[114px] rounded-[34px] flex flex-col items-center py-8 z-[100]"');

fs.writeFileSync('src/components/layout/AppShell.tsx', shell);

// --- 3. Fix TeamDashboard.tsx (Right side panels opacity/design) ---
let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

// Ensure Danger panel uses danger class properly with transparent bg
// The attention zone rows currently use 'bg-white/5'. 
dash = dash.replace(
  /bg-white\/5 border border-white\/5 hover:bg-white\/10 cursor-pointer/g,
  'bg-black/20 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] hover:bg-white/5 cursor-pointer'
);

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
