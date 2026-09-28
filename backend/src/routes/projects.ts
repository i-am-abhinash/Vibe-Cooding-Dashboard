import { Router } from 'express';
import { db } from '../firebase';
import { authenticate, requireRole, AuthRequest } from '../auth';
import { transitionProjectState } from '../transitionHelper';
import { INDIVIDUAL_PROJECT_STATES } from '../constants';

export const projectsRouter = Router();

async function getDocs(query: any) {
  const snap = await query.get();
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

projectsRouter.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
    const cycleId = cycleSnap.empty ? null : cycleSnap.docs[0].id;

    let query = db.collection('vibe_projects').where('cycleId', '==', cycleId).where('type', '==', 'individual');
    
    // Member can only see their own
    if (req.user.role === 'member') {
      query = query.where('memberId', '==', req.user.id);
    }

    const projects = await getDocs(query);
    
    // Attach member names for lead
    if (req.user.role !== 'member') {
      const members = await getDocs(db.collection('vibe_users').where('teamId', '==', req.user.teamId));
      projects.forEach(p => {
        const mem = members.find((m:any) => m.id === p.memberId);
        p.memberName = mem ? mem.name : 'Unknown';
      });
    }

    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

projectsRouter.post('/:id/idea', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  try {
    const { name, domain, description, expectedOutcome } = req.body;
    
    // Check state machine
    const ref = db.collection('vibe_projects').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Project not found' });
    
    const project = doc.data() as any;
    if (project.memberId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    
    // Update idea fields and trigger transition
    await ref.update({ name, domain, description, expectedOutcome });
    const result = await transitionProjectState(req.params.id, INDIVIDUAL_PROJECT_STATES.PLANNING, req.user.id, 'Idea submitted');
    
    res.json({ success: true, ...result });
  } catch(e: any) {
    res.status(400).json({ error: e.message });
  }
});

projectsRouter.post('/:id/submit', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  try {
    const { githubUrl, reportUrl } = req.body;
    if (!githubUrl || githubUrl.trim() === '') {
      return res.status(400).json({ error: 'GitHub URL is strictly required' });
    }

    const ref = db.collection('vibe_projects').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Project not found' });
    const project = doc.data() as any;
    if (project.memberId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await ref.update({ githubUrl, reportUrl, submissionDate: new Date().toISOString() });
    
    // If it was modified, resubmit, otherwise submit
    const newState = project.currentStatus === INDIVIDUAL_PROJECT_STATES.MODIFICATION_REQUESTED 
      ? INDIVIDUAL_PROJECT_STATES.RESUBMISSION 
      : INDIVIDUAL_PROJECT_STATES.GITHUB_SUBMISSION;

    const result = await transitionProjectState(req.params.id, newState, req.user.id, 'GitHub link submitted');
    res.json({ success: true, ...result });
  } catch(e: any) {
    res.status(400).json({ error: e.message });
  }
});

projectsRouter.post('/:id/review', authenticate, requireRole(['team_lead', 'co_lead', 'admin']), async (req: AuthRequest, res) => {
  try {
    const { action, comments, severity } = req.body; 
    // action: APPROVE, REJECT, VERIFY, REQUIRE_MODIFICATION
    const ref = db.collection('vibe_projects').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Project not found' });
    const project = doc.data() as any;

    let newState = '';
    
    if (action === 'APPROVE') newState = INDIVIDUAL_PROJECT_STATES.DEVELOPMENT; // Skip planning strictly to dev for idea approval
    else if (action === 'VERIFY') newState = INDIVIDUAL_PROJECT_STATES.COMPLETED;
    else if (action === 'REQUIRE_MODIFICATION') newState = INDIVIDUAL_PROJECT_STATES.MODIFICATION_REQUESTED;
    else return res.status(400).json({ error: 'Invalid review action' });

    await transitionProjectState(req.params.id, newState, req.user.id, comments);

    if (action === 'REQUIRE_MODIFICATION') {
      await db.collection('vibe_modifications').add({
        projectId: req.params.id,
        assignedTo: project.memberId,
        requestedBy: req.user.id,
        issue: comments || 'Modification required',
        severity: severity || 'MEDIUM',
        status: 'OPEN',
        requestedAt: new Date().toISOString()
      });
    }

    // Update reviewer fields
    await ref.update({
      reviewer: req.user.id,
      reviewerComments: comments
    });

    res.json({ success: true, newState });
  } catch(e: any) {
    res.status(400).json({ error: e.message });
  }
});
