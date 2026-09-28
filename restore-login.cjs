const fs = require('fs');
let routes = fs.readFileSync('backend/src/routes.ts', 'utf8');

const loginRoute = `
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const snapshot = await db.collection('vibe_users').where('email', '==', email).get();
    
    if (snapshot.empty) return res.status(401).json({ error: 'Invalid credentials' });
    const doc = snapshot.docs[0];
    const user = { id: doc.id, ...doc.data() } as any;

    if (!bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, teamId: user.teamId } });
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
});
`;

// Insert the login route right after const router = express.Router();
routes = routes.replace(
  /const router = express\.Router\(\);/,
  `const router = express.Router();\n${loginRoute}`
);

fs.writeFileSync('backend/src/routes.ts', routes);
