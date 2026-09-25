const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppShell.tsx', 'utf8');

code = code.replace(
  /<\/main>\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*\);\r?\n\}/,
  '</main>\n        </div>\n      </div>\n    </div>\n  );\n}'
);

// We need to also check if we missed removing parallax from <main>!
code = code.replace(/style={{ transform: `translate\(\${mousePos\.x \* 3}px, \${mousePos\.y \* 3}px\)` }}/, '');

fs.writeFileSync('src/components/layout/AppShell.tsx', code);
