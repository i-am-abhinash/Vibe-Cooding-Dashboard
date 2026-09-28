import { Router } from 'express';
import { db } from '../firebase';
import { authenticate, requireRole, AuthRequest } from '../auth';
import { calculateMemberGrowth } from '../services/growthEvaluator';
import { calculateGroupParticipation } from '../services/participationEvaluator';
import { detectAttentionItems } from '../services/attentionEvaluator';

export const membersRouter = Router();

async function getDocs(query: any) {
  const snap = await query.get();
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

membersRouter.get('/', authenticate, requireRole(['team_lead', 'co_lead', 'admin']), async (req: AuthRequest, res) => {
  try {
    const members = await getDocs(db.collection('vibe_users').where('teamId', '==', req.user.teamId).where('role', '==', 'member'));
    
    // To provide high-level stats for the members list, fetch cycle data
    const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
    const cycleId = cycleSnap.empty ? null : cycleSnap.docs[0].id;

    let projects = [];
    let groupProject = null;
    let activities = [];
    let contribs = [];
    let prs = [];
    let attendance = [];
    let modifications = [];

    if (cycleId) {
      projects = await getDocs(db.collection('vibe_projects').where('cycleId', '==', cycleId));
      groupProject = projects.find(p => p.type === 'group');
      
      modifications = await getDocs(db.collection('vibe_modifications'));
      activities = await getDocs(db.collection('vibe_activities'));
      contribs = await getDocs(db.collection('vibe_groupContributions'));
      prs = await getDocs(db.collection('vibe_pullRequests'));
      attendance = await getDocs(db.collection('vibe_attendanceCache'));
    }

    const enhancedMembers = members.map(m => {
      const memProjects = projects.filter(p => p.type === 'individual' && p.memberId === m.id);
      const memAtt = attendance.filter(a => a.memberId === m.id);
      const memMods = modifications.filter(mod => memProjects.some(p => p.id === mod.projectId));
      
      const part = calculateGroupParticipation(m.id, groupProject?.id || '', activities, contribs, prs);
      const growth = calculateMemberGrowth(m.id, cycleId || '', memProjects, part, memAtt, memMods);

      return {
        ...m,
        growth,
        participation: part,
        openModifications: modifications.filter(mod => mod.assignedTo === m.id && (mod.status === 'OPEN' || mod.status === 'IN_PROGRESS')).length
      };
    });

    res.json(enhancedMembers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

membersRouter.get('/:id', authenticate, requireRole(['team_lead', 'co_lead', 'admin']), async (req: AuthRequest, res) => {
  try {
    const doc = await db.collection('vibe_users').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    const member = { id: doc.id, ...doc.data() } as any;

    if (member.teamId !== req.user.teamId) return res.status(403).json({ error: 'Forbidden' });

    const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
    const cycleId = cycleSnap.empty ? null : cycleSnap.docs[0].id;

    const projects = await getDocs(db.collection('vibe_projects').where('cycleId', '==', cycleId || ''));
    const memProjects = projects.filter(p => p.type === 'individual' && p.memberId === member.id);
    const groupProject = projects.find(p => p.type === 'group');

    const activities = await getDocs(db.collection('vibe_activities').where('memberId', '==', member.id));
    const contribs = await getDocs(db.collection('vibe_groupContributions').where('memberId', '==', member.id));
    const prs = await getDocs(db.collection('vibe_pullRequests'));
    const attendance = await getDocs(db.collection('vibe_attendanceCache').where('memberId', '==', member.id));
    const modifications = await getDocs(db.collection('vibe_modifications').where('assignedTo', '==', member.id));
    const dailyReports = await getDocs(db.collection('vibe_dailyReports').where('memberId', '==', member.id));
    const presentations = await getDocs(db.collection('vibe_presentations').where('memberId', '==', member.id));

    const part = calculateGroupParticipation(member.id, groupProject?.id || '', activities, contribs, prs);
    const growth = calculateMemberGrowth(member.id, cycleId || '', memProjects, part, attendance, modifications);
    const attentionItems = detectAttentionItems(memProjects, groupProject, [], [], modifications, [member], { [member.id]: part });

    res.json({
      profile: member,
      projects: memProjects,
      groupContribution: part,
      growth,
      attendance,
      dailyReports,
      presentations,
      modifications,
      attentionItems
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
