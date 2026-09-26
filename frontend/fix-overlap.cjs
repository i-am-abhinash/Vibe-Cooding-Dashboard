const fs = require('fs');

let dash = fs.readFileSync('src/pages/TeamDashboard.tsx', 'utf8');

dash = dash.replace(
  /className="absolute top-\[8%\] lg:top-\[12%\] left-\[4%\] lg:left-\[8%\] w-\[230px\] h-\[100px\] pointer-events-auto glass-panel rounded-\[20px\] p-4 flex flex-col justify-center shadow-\[0_0_20px_rgba\(77,163,255,0\.2\)\]"/,
  'className="absolute top-[2%] lg:top-[5%] left-[-5%] lg:left-[2%] w-[210px] h-[90px] pointer-events-auto glass-panel rounded-[20px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(77,163,255,0.2)]"'
);

dash = dash.replace(
  /className="absolute top-\[8%\] lg:top-\[12%\] right-\[4%\] lg:right-\[8%\] w-\[190px\] h-\[95px\] pointer-events-auto glass-panel rounded-\[20px\] p-4 flex flex-col justify-center shadow-\[0_0_20px_rgba\(139,92,246,0\.2\)\]"/,
  'className="absolute top-[2%] lg:top-[5%] right-[-5%] lg:right-[2%] w-[180px] h-[90px] pointer-events-auto glass-panel rounded-[20px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]"'
);

dash = dash.replace(
  /className="absolute bottom-\[10%\] lg:bottom-\[15%\] left-\[6%\] lg:left-\[10%\] w-\[190px\] h-\[95px\] pointer-events-auto glass-panel rounded-\[20px\] p-4 flex flex-col justify-center shadow-\[0_0_20px_rgba\(77,163,255,0\.2\)\]"/,
  'className="absolute bottom-[2%] lg:bottom-[8%] left-[-2%] lg:left-[5%] w-[180px] h-[90px] pointer-events-auto glass-panel rounded-[20px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(77,163,255,0.2)]"'
);

dash = dash.replace(
  /className="absolute bottom-\[10%\] lg:bottom-\[15%\] right-\[6%\] lg:right-\[10%\] w-\[190px\] h-\[95px\] pointer-events-auto glass-panel rounded-\[20px\] p-4 flex flex-col justify-center shadow-\[0_0_20px_rgba\(139,92,246,0\.3\)\]"/,
  'className="absolute bottom-[2%] lg:bottom-[8%] right-[-2%] lg:right-[5%] w-[180px] h-[90px] pointer-events-auto glass-panel rounded-[20px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]"'
);

// Reduce orb max-size slightly to give more room for the cards
dash = dash.replace(/className="w-\[clamp\(450px,36vw,600px\)\] aspect-square pointer-events-auto"/, 'className="w-[clamp(350px,40vw,550px)] aspect-square pointer-events-auto"');

fs.writeFileSync('src/pages/TeamDashboard.tsx', dash);
