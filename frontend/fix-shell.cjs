const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppShell.tsx', 'utf8');

code = code.replace(
  /<div className="w-screen h-screen overflow-hidden bg-brand-bg-1 font-sans">\s*<div \s*className="exact-container"/m,
  '<div className="exact-container-wrapper font-sans">\n      <div className="exact-container-scaler">\n        <div \n          className="exact-container"'
);

code = code.replace(
  /w-\[130px\]/,
  'w-[114px]'
);

code = code.replace(
  /w-\[55px\] h-\[55px\]/,
  'w-[46px] h-[46px]'
);

code = code.replace(
  /w-\[50px\] h-\[50px\]/,
  'w-[42px] h-[42px]'
);

code = code.replace(
  /gap-6 items-center/g,
  'gap-5 items-center'
);

code = code.replace(
  /py-10/g,
  'py-8'
);

code = code.replace(
  /text-2xl/g,
  'text-xl'
);

code = code.replace(
  /mb-12/g,
  'mb-10'
);

code = code.replace(
  /left-\[140px\]/g,
  'left-[124px]'
);

code = code.replace(
  /<\/div>\n    <\/div>\n  \);\n}/,
  '        </div>\n      </div>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/components/layout/AppShell.tsx', code);
