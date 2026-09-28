const fs = require('fs');

let transition = fs.readFileSync('backend/src/transitionHelper.ts', 'utf8');
transition = transition.replace(/\\`/g, '`');
transition = transition.replace(/\\\$/g, '$');
fs.writeFileSync('backend/src/transitionHelper.ts', transition);

let routes = fs.readFileSync('backend/src/routes.ts', 'utf8');
// Move imports to the top
routes = routes.replace(/import bcrypt from 'bcryptjs';\nimport jwt from 'jsonwebtoken';\n/, '');
routes = `import bcrypt from 'bcryptjs';\nimport jwt from 'jsonwebtoken';\n` + routes;

fs.writeFileSync('backend/src/routes.ts', routes);
