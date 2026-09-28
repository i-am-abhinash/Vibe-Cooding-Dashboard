const fs = require('fs');
let routes = fs.readFileSync('backend/src/routes.ts', 'utf8');

const newRoutes = `
import { transitionProjectState } from './transitionHelper';

router.post('/projects/:id/transition', authenticate, async (req: AuthRequest, res) => {
  try {
    const { newState, comment } = req.body;
    const result = await transitionProjectState(req.params.id, newState, req.user.id, comment);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/group/requirements/:id/verify', authenticate, requireRole(['team_lead', 'admin']), async (req: AuthRequest, res) => {
  try {
    const { status, comment, projectId } = req.body; 
    const ref = db.collection('vibe_requirements').doc(req.params.id);
    await ref.update({
      status, 
      reviewer: req.user.id, 
      reviewerComment: comment, 
      verifiedAt: new Date().toISOString()
    });

    if (status === 'FAILED' || status === 'MODIFICATION_REQUIRED') {
      await db.collection('vibe_modifications').add({
        projectId: projectId,
        requirementId: req.params.id,
        issue: comment || 'Requirement failed verification',
        severity: 'HIGH',
        status: 'OPEN',
        requestedAt: new Date().toISOString()
      });
    }
    res.json({ success: true });
  } catch(e: any) {
    res.status(400).json({ error: e.message });
  }
});
`;

// Append only if not already present
if (!routes.includes('/projects/:id/transition')) {
  routes += newRoutes;
  fs.writeFileSync('backend/src/routes.ts', routes);
}
