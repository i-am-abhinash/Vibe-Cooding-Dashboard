import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './firebase';
import { authenticate, requireRole, AuthRequest } from './auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Helper to get all docs from a query
const getDocs = async (query: any) => {
  const snapshot = await query.get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
};

// --- AUTH ---
router.post('/login', async (req, res) => {
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
});

// --- DASHBOARD (Team Lead / Co-Lead) ---
router.get('/team-dashboard', authenticate, requireRole(['team_lead', 'co_lead']), async (req: AuthRequest, res) => {
  const teamId = req.user.teamId;
  
  const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', teamId).where('status', '==', 'active').get();
  const cycle = cycleSnap.empty ? null : { id: cycleSnap.docs[0].id, ...cycleSnap.docs[0].data() };
  
  const membersSnap = await db.collection('vibe_users').where('teamId', '==', teamId).where('role', '==', 'member').get();
  let members = membersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  let pendingReviews = 0;

  for (let m of members) {
    m.projects = await getDocs(db.collection('vibe_projects').where('memberId', '==', m.id).where('cycleId', '==', cycle?.id || '').where('type', '==', 'individual'));
    m.groupContributions = await getDocs(db.collection('vibe_groupContributions').where('memberId', '==', m.id));
    m.attendance = await getDocs(db.collection('vibe_attendanceCache').where('memberId', '==', m.id));

    pendingReviews += m.projects.filter((p: any) => p.ideaStatus === 'submitted' || p.status === 'pending_verification' || p.status === 'resubmitted').length;
  }

  res.json({ cycle, members, pendingReviews });
});

router.get('/members/:id', authenticate, requireRole(['team_lead', 'co_lead']), async (req: AuthRequest, res) => {
  const doc = await db.collection('vibe_users').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  
  const member = { id: doc.id, ...doc.data() } as any;
  member.projects = await getDocs(db.collection('vibe_projects').where('memberId', '==', member.id));
  member.groupContributions = await getDocs(db.collection('vibe_groupContributions').where('memberId', '==', member.id));
  member.attendance = await getDocs(db.collection('vibe_attendanceCache').where('memberId', '==', member.id));
  member.dailyReports = await getDocs(db.collection('vibe_dailyReports').where('memberId', '==', member.id));

  res.json(member);
});

// --- MEMBER DASHBOARD ---
router.get('/my-dashboard', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
  const cycle = cycleSnap.empty ? null : { id: cycleSnap.docs[0].id, ...cycleSnap.docs[0].data() };

  const member = { ...req.user };
  member.projects = await getDocs(db.collection('vibe_projects').where('memberId', '==', member.id).where('cycleId', '==', cycle?.id || ''));
  member.groupContributions = await getDocs(db.collection('vibe_groupContributions').where('memberId', '==', member.id));
  member.attendance = await getDocs(db.collection('vibe_attendanceCache').where('memberId', '==', member.id));

  res.json({ cycle, member });
});

// --- INDIVIDUAL PROJECT WORKFLOW ---
router.post('/projects/idea', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  const { name, domain, expectedOutcome, cycleId } = req.body;
  
  const currentProjects = await getDocs(db.collection('vibe_projects').where('memberId', '==', req.user.id).where('cycleId', '==', cycleId).where('type', '==', 'individual'));
  if (currentProjects.length >= 4) return res.status(400).json({ error: 'Max 4 individual projects allowed' });

  const ref = await db.collection('vibe_projects').add({
    type: 'individual',
    name, domain, expectedOutcome,
    ideaStatus: 'submitted',
    status: 'idea_submitted',
    memberId: req.user.id,
    cycleId,
    createdAt: new Date().toISOString()
  });
  
  const doc = await ref.get();
  res.json({ id: doc.id, ...doc.data() });
});

router.post('/projects/:id/review-idea', authenticate, requireRole(['team_lead', 'co_lead']), async (req: AuthRequest, res) => {
  const { status, comments } = req.body;
  const ideaStatus = status === 'idea_approved' ? 'approved' : 'changes_requested';
  
  await db.collection('vibe_projects').doc(req.params.id).update({
    ideaStatus,
    status,
    ideaReviewedBy: req.user.id,
    ideaReviewedAt: new Date().toISOString()
  });
  
  res.json({ success: true });
});

router.post('/projects/:id/start', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  const doc = await db.collection('vibe_projects').doc(req.params.id).get();
  if (doc.data()?.ideaStatus !== 'approved') return res.status(400).json({ error: 'Idea not approved' });

  await db.collection('vibe_projects').doc(req.params.id).update({ status: 'in_progress' });
  res.json({ success: true });
});

router.post('/projects/:id/submit', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  const { githubUrl, reportUrl } = req.body;
  if (!githubUrl || githubUrl.trim() === '') {
    return res.status(400).json({ error: 'githubUrl is strictly required to submit a project' });
  }
  
  await db.collection('vibe_projects').doc(req.params.id).update({
    status: 'pending_verification',
    githubUrl,
    reportUrl: reportUrl || null,
    submittedAt: new Date().toISOString()
  });
  res.json({ success: true });
});

router.post('/projects/:id/verify', authenticate, requireRole(['team_lead', 'co_lead']), async (req: AuthRequest, res) => {
  const { action, comments } = req.body; 
  const status = action === 'verify' ? 'verified' : 'modification_required';
  
  await db.collection('vibe_projects').doc(req.params.id).update({
    status,
    completedAt: action === 'verify' ? new Date().toISOString() : null
  });

  if (action === 'request_modification') {
    await db.collection('vibe_modifications').add({
      requestedBy: req.user.id,
      description: comments || 'Modification required',
      projectId: req.params.id,
      status: 'pending',
      requestedAt: new Date().toISOString()
    });
  }

  res.json({ success: true });
});

// --- GROUP PROJECT WORKFLOW ---
router.post('/group-contributions/:id/submit', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  const { githubUrl, branch } = req.body;
  if (!githubUrl || githubUrl.trim() === '') {
    return res.status(400).json({ error: 'githubUrl is strictly required to submit a contribution' });
  }

  await db.collection('vibe_groupContributions').doc(req.params.id).update({
    status: 'contribution_submitted',
    githubUrl,
    branch: branch || null
  });
  res.json({ success: true });
});

// --- AT-RISK DETECTION ---
router.get('/members/:id/risk', authenticate, async (req: AuthRequest, res) => {
  const memberId = req.params.id;
  const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
  if (cycleSnap.empty) return res.json({ riskReasons: [] });
  const cycle = { id: cycleSnap.docs[0].id, ...cycleSnap.docs[0].data() } as any;

  const projects = await getDocs(db.collection('vibe_projects').where('memberId', '==', memberId).where('cycleId', '==', cycle.id).where('type', '==', 'individual'));
  const contributions = await getDocs(db.collection('vibe_groupContributions').where('memberId', '==', memberId));
  const attendance = await getDocs(db.collection('vibe_attendanceCache').where('memberId', '==', memberId));
  const modifications = await getDocs(db.collection('vibe_modifications').where('projectId', 'in', projects.map((p:any) => p.id) || ['NONE'])); // Simple approximation
  const reports = await getDocs(db.collection('vibe_dailyReports').where('memberId', '==', memberId));

  const riskReasons: string[] = [];
  
  if (projects.length < 4) riskReasons.push("Fewer than 4 individual projects submitted/approved");
  
  const overdueMods = modifications.filter((m: any) => m.status === 'overdue' || (m.deadline && new Date(m.deadline) < new Date() && m.status !== 'completed'));
  if (overdueMods.length > 0) riskReasons.push("Overdue modifications");

  const missingRepoContribs = contributions.filter((c: any) => c.status !== 'not_assigned' && !c.githubUrl);
  if (missingRepoContribs.length > 0) riskReasons.push("Group contribution missing repository evidence");

  const presentDays = attendance.filter((a: any) => a.status === 'present').length;
  const totalDays = attendance.length;
  const attPct = totalDays > 0 ? (presentDays / totalDays) * 100 : 100;
  if (attPct < 80) riskReasons.push(`Attendance below threshold (${attPct.toFixed(1)}%)`);

  if (reports.length < 3) riskReasons.push("Missing daily reports");

  res.json({ riskReasons });
});

export default router;
