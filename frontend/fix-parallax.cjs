const fs = require('fs');
let shell = fs.readFileSync('src/components/layout/AppShell.tsx', 'utf8');

shell = shell.replace(/style={{ transform: `translate\(\${mousePos\.x \* [^}]+\}px, \${mousePos\.y \* [^}]+\}px\)` }}/g, '');
// Wait, I will just remove the whole style attribute since it only contains the mousePos transform on those elements.
shell = shell.replace(/style=\{\{\s*transform:\s*`translate\(\$\{mousePos[^`]+`\s*\}\}/g, '');

fs.writeFileSync('src/components/layout/AppShell.tsx', shell);
