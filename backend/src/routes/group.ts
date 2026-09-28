import { Router } from 'express';
import { db } from '../firebase';
import { authenticate, requireRole, AuthRequest } from '../auth';
import { evaluateRequirements } from '../services/requirementEvaluator';
import { evaluateFunctionality } from '../services/functionalityEvaluator';

export const groupRouter = Router();

async function getDocs(query: any) {
  const snap = await query.get();
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

groupRouter.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
    if (cycleSnap.empty) return res.json(null);
    const cycleId = cycleSnap.docs[0].id;

    const groupSnap = await db.collection('vibe_projects').where('cycleId', '==', cycleId).where('type', '==', 'group').get();
    if (groupSnap.empty) return res.json(null);
    
    const project = { id: groupSnap.docs[0].id, ...groupSnap.docs[0].data() } as any;

    const requirements = await getDocs(db.collection('vibe_requirements').where('groupProjectId', '==', project.id));
    const tests = await getDocs(db.collection('vibe_functionalityReviews').where('groupProjectId', '==', project.id));
    
    let contributions = await getDocs(db.collection('vibe_groupContributions').where('projectId', '==', project.id));
    
    // member filters for their own task specifically
    if (req.user.role === 'member') {
       contributions = contributions.filter(c => c.memberId === req.user.id);
    } else {
       const members = await getDocs(db.collection('vibe_users').where('teamId', '==', req.user.teamId));
       contributions.forEach(c => {
         const mem = members.find((m:any) => m.id === c.memberId);
         c.memberName = mem ? mem.name : 'Unknown';
       });
    }

    const prs = await getDocs(db.collection('vibe_pullRequests'));
    
    contributions.forEach(c => {
      c.pullRequests = prs.filter(p => p.contributionId === c.id);
    });

    res.json({
      project,
      requirements,
      tests,
      contributions,
      requirementEvaluation: evaluateRequirements(requirements),
      functionalityEvaluation: evaluateFunctionality(tests)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

groupRouter.post('/requirements/:id/verify', authenticate, requireRole(['team_lead', 'co_lead', 'admin']), async (req: AuthRequest, res) => {
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

groupRouter.post('/contributions/:id/submit', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  try {
    const { githubUrl, branch } = req.body;
    const ref = db.collection('vibe_groupContributions').doc(req.params.id);
    const doc = await ref.get();
    
    if (!doc.exists) return res.status(404).json({ error: 'Contribution not found' });
    if (doc.data()?.memberId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await ref.update({
      status: 'contribution_submitted',
      githubUrl,
      branch
    });
    
    // Auto-create PR entry for tracking
    await db.collection('vibe_pullRequests').add({
      contributionId: req.params.id,
      prUrl: githubUrl,
      status: 'open',
      createdAt: new Date().toISOString()
    });

    res.json({ success: true });
  } catch(e: any) {
    res.status(400).json({ error: e.message });
  }
});
