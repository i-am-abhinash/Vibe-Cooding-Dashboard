import { Router } from 'express';
import { db } from '../firebase';
import { authenticate, requireRole, AuthRequest } from '../auth';
import { INDIVIDUAL_PROJECT_STATES } from '../constants';

export const reviewsRouter = Router();

async function getDocs(query: any) {
  const snap = await query.get();
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

reviewsRouter.get('/', authenticate, requireRole(['team_lead', 'co_lead', 'admin']), async (req: AuthRequest, res) => {
  try {
    const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
    const cycleId = cycleSnap.empty ? null : cycleSnap.docs[0].id;

    // Get all projects waiting for something
    const projects = await getDocs(db.collection('vibe_projects').where('cycleId', '==', cycleId));
    
    const pendingIdeas = projects.filter(p => p.type === 'individual' && p.currentStatus === INDIVIDUAL_PROJECT_STATES.IDEA);
    const pendingVerifications = projects.filter(p => p.type === 'individual' && (p.currentStatus === INDIVIDUAL_PROJECT_STATES.VERIFICATION || p.currentStatus === INDIVIDUAL_PROJECT_STATES.FINAL_VERIFICATION));
    
    const modifications = await getDocs(db.collection('vibe_modifications').where('status', '==', 'OPEN'));
    
    const groupProject = projects.find(p => p.type === 'group');
    let pendingRequirements = [];
    let pendingFunctionality = [];
    
    if (groupProject) {
       const reqs = await getDocs(db.collection('vibe_requirements').where('groupProjectId', '==', groupProject.id));
       pendingRequirements = reqs.filter(r => r.status === 'NOT_STARTED' || r.status === 'SUBMITTED');
       
       const tests = await getDocs(db.collection('vibe_functionalityReviews').where('groupProjectId', '==', groupProject.id));
       pendingFunctionality = tests.filter(t => t.status === 'NOT_TESTED');
    }

    const members = await getDocs(db.collection('vibe_users').where('teamId', '==', req.user.teamId));

    const attachMember = (item: any, idField: string) => {
      const m = members.find((m:any) => m.id === item[idField]);
      item.memberName = m ? m.name : 'Unknown';
      return item;
    };

    res.json({
      pendingIdeas: pendingIdeas.map(p => attachMember(p, 'memberId')),
      pendingVerifications: pendingVerifications.map(p => attachMember(p, 'memberId')),
      pendingModifications: modifications.map(m => attachMember(m, 'assignedTo')),
      pendingRequirements,
      pendingFunctionality
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
