import express from 'express';
import { db } from './firebase';
import { authenticate, requireRole, AuthRequest } from './auth';
import { buildTeamDashboard, buildMemberDashboard } from './services/dashboardAggregator';

const router = express.Router();

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


async function getDocs(query: any) {
  const snap = await query.get();
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

router.get('/team-dashboard', authenticate, requireRole(['team_lead', 'co_lead', 'admin']), async (req: AuthRequest, res) => {
  const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
  const cycle = cycleSnap.empty ? null : { id: cycleSnap.docs[0].id, ...cycleSnap.docs[0].data() } as any;

  if (!cycle) return res.json({ error: 'No active cycle' });

  const members = await getDocs(db.collection('vibe_users').where('teamId', '==', req.user.teamId).where('role', '==', 'member'));
  const projects = await getDocs(db.collection('vibe_projects').where('cycleId', '==', cycle.id));
  
  const individualProjects = projects.filter(p => p.type === 'individual');
  const groupProject = projects.find(p => p.type === 'group');

  let requirements = [];
  let tests = [];
  let mods = [];
  let activities = [];
  let contribs = [];
  let prs = [];
  let attendance = [];

  if (groupProject) {
    requirements = await getDocs(db.collection('vibe_requirements').where('groupProjectId', '==', groupProject.id));
    tests = await getDocs(db.collection('vibe_functionalityReviews').where('groupProjectId', '==', groupProject.id));
  }

  const projectIds = projects.map(p => p.id);
  if (projectIds.length > 0) {
    // chunking might be needed in prod, but fine for 100 projects
    mods = await getDocs(db.collection('vibe_modifications'));
    contribs = await getDocs(db.collection('vibe_groupContributions'));
    prs = await getDocs(db.collection('vibe_pullRequests'));
    activities = await getDocs(db.collection('vibe_activities'));
  }

  const memberIds = members.map(m => m.id);
  if (memberIds.length > 0) {
    attendance = await getDocs(db.collection('vibe_attendanceCache'));
  }

  const dashboardData = await buildTeamDashboard(
    req.user.teamId, cycle.id, members, individualProjects, groupProject, 
    requirements, tests, mods, activities, contribs, prs, attendance
  );

  res.json({ cycle, dashboard: dashboardData });
});

router.get('/my-dashboard', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
  const cycle = cycleSnap.empty ? null : { id: cycleSnap.docs[0].id, ...cycleSnap.docs[0].data() } as any;

  const member = { ...req.user };
  const projects = await getDocs(db.collection('vibe_projects').where('cycleId', '==', cycle?.id || ''));
  
  const groupProject = projects.find(p => p.type === 'group');
  const individualProjects = projects.filter(p => p.type === 'individual');

  const mods = await getDocs(db.collection('vibe_modifications').where('assignedTo', '==', member.id));
  const activities = await getDocs(db.collection('vibe_activities').where('memberId', '==', member.id));
  const contribs = await getDocs(db.collection('vibe_groupContributions').where('memberId', '==', member.id));
  const prs = await getDocs(db.collection('vibe_pullRequests'));
  const attendance = await getDocs(db.collection('vibe_attendanceCache').where('memberId', '==', member.id));

  const dashboardData = buildMemberDashboard(
    member, cycle?.id, individualProjects, groupProject, activities, contribs, prs, attendance, mods
  );

  res.json({ cycle, dashboard: dashboardData });
});

export default router;

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
