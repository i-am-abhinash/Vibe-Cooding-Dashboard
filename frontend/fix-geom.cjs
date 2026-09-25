const fs = require('fs');

// --- 1. Fix AppShell.tsx (Parallax removal, main offset) ---
let shell = fs.readFileSync('src/components/layout/AppShell.tsx', 'utf8');

// Completely remove any mousePos transforms
shell = shell.replace(/style={{ transform: `translate[^}]*` }}/g, '');
shell = shell.replace(/style={{ transform: `translate\([^}]+\)` }}/g, '');
shell = shell.replace(/style={{[^}]*mousePos[^}]*}}/g, '');

// Ensure correct boundaries
shell = shell.replace(/className="absolute left-\[140px\] right-\[24px\] top-\[24px\]/g, 'className="absolute left-[124px] right-[24px] top-[24px]');
shell = shell.replace(/className="absolute left-\[140px\] right-\[24px\] top-\[104px\]/g, 'className="absolute left-[124px] right-[24px] top-[104px]');

// Ensure Sidebar inner stacking is perfect
shell = shell.replace(/z-0/g, 'z-[0]');
shell = shell.replace(/z-10/g, 'z-[10]');
shell = shell.replace(/z-20/g, 'z-[20]');
// Actually they are fine as `z-10` etc, I'll just leave them if they work, but -z-20 was breaking it.
// I'll make sure aside has z-[100] exactly.
shell = shell.replace(/z-50/g, 'z-[100]');

fs.writeFileSync('src/components/layout/AppShell.tsx', shell);

// --- 2. Fix TeamDashboard.tsx (Card positions) ---
let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

// Team Members Card: was left-[0px], move to left-[40px] so it has breathing room after the 124px boundary.
// Actually, left-0 inside <main> starts precisely at 124px. So left-0 is fine, but if it overlaps the sidebar visually due to shadows, left-[20px] is safer.
dash = dash.replace(/left-\[0px\] w-\[220px\] h-\[100px\]/, 'left-[20px] w-[220px] h-[100px]');

// Attendance Card (left-[-20px] w-[200px]) -> left-[30px]
dash = dash.replace(/left-\[-20px\] w-\[200px\]/, 'left-[30px] w-[200px]');

// Central Scene (left-[50px] w-[700px]) -> left-[260px] to center it between left cards and right panels.
dash = dash.replace(/left-\[50px\] w-\[700px\]/, 'left-[260px] w-[700px]');

// Total Projects (left-[550px]) -> left-[320px] (wait, maybe this is around the sphere, let's keep it near)
// If sphere is at 260px and 700px wide (center is 610px), the right cards should be around left-[750px]
dash = dash.replace(/left-\[550px\] w-\[200px\]/, 'left-[800px] w-[200px]');
dash = dash.replace(/left-\[520px\] w-\[200px\]/, 'left-[800px] w-[200px]'); // Group project

// Date Strip (left-[0px]) -> left-[20px]
dash = dash.replace(/absolute top-0 left-0 flex items-center/, 'absolute top-[10px] left-[20px] flex items-center');

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
