const fs = require('fs');
let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

// The Team Members card is at left-[0px] -> Change to left-[20px] to give it breathing room past the sidebar
dash = dash.replace(/left-\[0px\] w-\[220px\] h-\[100px\]/, 'left-[20px] w-[220px] h-[100px]');

// Attendance card is left-[-20px] -> Change to positive left-[20px]
dash = dash.replace(/left-\[-20px\] w-\[200px\] h-\[100px\]/, 'left-[20px] w-[200px] h-[100px]');

// The user also says: "CENTRAL SCENE: centered in the available main dashboard region. Do NOT let it overlap the sidebar."
// "Wait, if left cards are at 20px, they end at 240px. The right panels start at 1536-124-24-420 = 968. The space is 240 to 968.
// Scene is 700px wide. Gap is 728px. Center is 240 + 14 = 254px."
dash = dash.replace(/left-\[50px\] w-\[700px\] h-\[700px\]/, 'left-[134px] w-[700px] h-[700px]');

// Total Projects is at left-[550px]
dash = dash.replace(/left-\[550px\] w-\[200px\] h-\[100px\]/, 'left-[740px] w-[200px] h-[100px]');

// Group Project is at left-[520px]
dash = dash.replace(/left-\[520px\] w-\[200px\] h-\[100px\]/, 'left-[740px] w-[200px] h-[100px]');

// Date strip at left-[0px]
dash = dash.replace(/absolute top-0 left-0 flex items-center/, 'absolute top-0 left-[20px] flex items-center');

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
