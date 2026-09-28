const fs = require('fs');

let routes = fs.readFileSync('backend/src/routes.ts', 'utf8');

const imports = `
import { membersRouter } from './routes/members';
import { projectsRouter } from './routes/projects';
import { groupRouter } from './routes/group';
import { reviewsRouter } from './routes/reviews';
`;

const mounts = `
router.use('/members', membersRouter);
router.use('/projects', projectsRouter);
router.use('/group', groupRouter);
router.use('/reviews', reviewsRouter);
`;

// Inject imports below the top imports
routes = routes.replace(
  /import \{ buildTeamDashboard, buildMemberDashboard \} from '\.\/services\/dashboardAggregator';/,
  `import { buildTeamDashboard, buildMemberDashboard } from './services/dashboardAggregator';\n${imports}`
);

// Inject mounts below const router = express.Router();
routes = routes.replace(
  /const router = express\.Router\(\);/,
  `const router = express.Router();\n${mounts}`
);

fs.writeFileSync('backend/src/routes.ts', routes);
