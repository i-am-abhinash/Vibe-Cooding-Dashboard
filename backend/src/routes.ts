import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import { db } from './firebase';
import { authenticate, requireRole, AuthRequest } from './auth';
import { buildTeamDashboard, buildMemberDashboard } from './services/dashboardAggregator';

import { membersRouter } from './routes/members';
import { projectsRouter } from './routes/projects';
import { groupRouter } from './routes/group';
import { reviewsRouter } from './routes/reviews';


import { workflowRouter } from './routes/workflow';
import { calculateManagedParticipation } from './services/participationEvaluator';
import { calculateMemberGrowth } from './services/growthEvaluator';
const router = express.Router();
router.use('/workflow', workflowRouter);
// Legacy mutation endpoints must not bypass managed feature workflow.
router.use('/projects/:id', (req,res,next)=>{
 if(req.method==='GET'||req.method==='HEAD')return next();
 return authenticate(req as AuthRequest,res,async()=>{
  try{const doc=await db.collection('vibe_projects').doc(req.params.id).get();const p=doc.data();if(p?.managedWorkflow)return res.status(409).json({error:'Use the feature workflow for this project'});
  if(p){const u=(req as AuthRequest).user;const cycle=await db.collection('vibe_monthlyCycles').doc(p.cycleId).get();if(cycle.data()?.teamId!==u.teamId||cycle.data()?.status!=='active'||u.role==='member'&&p.memberId!==u.id)return res.status(403).json({error:'Forbidden'});}
  next();}catch(e){res.status(500).json({error:'Unable to authorize project'});}
 });
});

router.use('/members', membersRouter);
router.use('/projects', projectsRouter);
router.use('/group', groupRouter);
router.use('/reviews', reviewsRouter);



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

  const members = (await getDocs(db.collection('vibe_users').where('teamId', '==', req.user.teamId).where('role', '==', 'member'))).filter(m=>m.active!==false&&m.status!=='inactive').map(({passwordHash,password,...m})=>m);
  const projects = await getDocs(db.collection('vibe_projects').where('cycleId', '==', cycle.id));
  
  const individualProjects = projects.filter(p => p.type === 'individual');
  const groups = projects.filter(p => p.type === 'group');
  const groupProject = groups[0];

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

  mods=mods.filter(m=>projectIds.includes(m.projectId)); activities=activities.filter(a=>a.cycleId===cycle.id||projectIds.includes(a.projectId)); contribs=contribs.filter(c=>projectIds.includes(c.projectId)); prs=prs.filter(p=>contribs.some(c=>c.id===p.contributionId));
  const memberIds = members.map(m => m.id);
  if (memberIds.length > 0) {
    attendance = (await getDocs(db.collection('vibe_attendanceCache'))).filter(a=>memberIds.includes(a.memberId));
  }

  const dashboardData = await buildTeamDashboard(
    req.user.teamId, cycle.id, members, individualProjects, groupProject, 
    requirements, tests, mods, activities, contribs, prs, attendance
  );

  if(cycle.managedWorkflow){
    const managedGroups=groups.filter(g=>g.managedWorkflow);
    const managedIndividuals=individualProjects.filter(p=>p.managedWorkflow);
    const average=(rows:any[])=>rows.length?Math.round(rows.reduce((s,p)=>s+(Number(p.progressPercentage)||0),0)/rows.length):0;
    const gp=average(managedGroups);const ip=average(managedIndividuals);
    const alerts=[...managedIndividuals,...managedGroups].filter(p=>p.deadline&&new Date(p.deadline)<new Date()&&p.progressPercentage<100).map(p=>({type:'OVERDUE_PROJECT',severity:'HIGH',projectId:p.id,memberId:p.memberId,title:(p.name||p.assignmentName||p.groupName)+' overdue',description:'Submission deadline has passed.'}));
    const reopened=[...managedIndividuals,...managedGroups].flatMap(p=>(p.features||[]).filter((f:any)=>f.status==='REOPENED').map((f:any)=>({type:'FEATURE_REOPENED',severity:'HIGH',projectId:p.id,memberId:p.memberId,title:f.title,description:f.reviewNote||'Modification required'})));
    const memberDetails=members.map(m=>{const part=calculateManagedParticipation(m.id,managedGroups);const growth=calculateMemberGrowth(m.id,cycle.id,managedIndividuals.filter(p=>p.memberId===m.id),part,attendance.filter(a=>a.memberId===m.id),mods.filter(mod=>mod.assignedTo===m.id));return {...m,growth,participation:part};});
    Object.assign(dashboardData,{membersDetails:memberDetails,activeParticipants:memberDetails.filter(m=>m.participation.active).length,inactiveParticipants:memberDetails.filter(m=>!m.participation.active).length,membersOnTrack:memberDetails.filter(m=>['On Track','Completed'].includes(m.growth.status)).length,membersNeedingAttention:memberDetails.filter(m=>m.growth.status==='Needs Attention').length,individualProjectsExpected:managedIndividuals.length,individualProjectsCompleted:managedIndividuals.filter(p=>p.progressPercentage===100).length,individualProjectCompletionRate:ip,groupProjectProgress:managedGroups.length?Math.round(ip*.4+gp*.6):ip,groupProjectsProgress:gp,groupProjectCount:managedGroups.length,attentionItems:[...alerts,...reopened],recentActivity:activities.filter(a=>a.cycleId===cycle.id||projectIds.includes(a.projectId)).sort((a,b)=>String(b.timestamp).localeCompare(String(a.timestamp))).slice(0,200)});
  }
  res.json({ cycle, dashboard: dashboardData });
});

router.get('/my-dashboard', authenticate, requireRole(['member']), async (req: AuthRequest, res) => {
  const cycleSnap = await db.collection('vibe_monthlyCycles').where('teamId', '==', req.user.teamId).where('status', '==', 'active').get();
  const cycle = cycleSnap.empty ? null : { id: cycleSnap.docs[0].id, ...cycleSnap.docs[0].data() } as any;

  const { passwordHash, password, ...member } = req.user;
  const projects = await getDocs(db.collection('vibe_projects').where('cycleId', '==', cycle?.id || ''));
  
  const groupProject = projects.find(p => p.type === 'group' && (!p.managedWorkflow || p.memberIds?.includes(member.id)));
  const individualProjects = projects.filter(p => p.type === 'individual');

  const mods = await getDocs(db.collection('vibe_modifications').where('assignedTo', '==', member.id));
  const activities = await getDocs(db.collection('vibe_activities').where('memberId', '==', member.id));
  const contribs = await getDocs(db.collection('vibe_groupContributions').where('memberId', '==', member.id));
  const prs = await getDocs(db.collection('vibe_pullRequests'));
  const attendance = await getDocs(db.collection('vibe_attendanceCache').where('memberId', '==', member.id));

  const dashboardData = buildMemberDashboard(
    member, cycle?.id, individualProjects, groupProject, activities, contribs, prs, attendance, mods
  );

  if(cycle?.managedWorkflow){
    const groups=projects.filter(p=>p.type==='group'&&p.managedWorkflow&&p.memberIds?.includes(member.id));
    const part=calculateManagedParticipation(member.id,groups);
    dashboardData.growth=calculateMemberGrowth(member.id,cycle.id,individualProjects.filter(p=>p.memberId===member.id),part,attendance,mods.filter(m=>projects.some(p=>p.id===m.projectId)));
    dashboardData.groupProject={...groupProject,participation:part};
    Object.assign(dashboardData,{groups:groups.map(g=>({id:g.id,name:g.name,groupName:g.groupName,deadline:g.deadline,progressPercentage:g.progressPercentage})),projects:individualProjects.filter(p=>p.memberId===member.id).sort((a,b)=>a.slot-b.slot).map(p=>({...p,evaluation:{percentage:p.progressPercentage,completed:p.verificationStatus==='VERIFIED'}}))});
  }
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
