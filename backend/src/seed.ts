import { db } from './firebase';
import bcrypt from 'bcryptjs';
import { 
  INDIVIDUAL_PROJECT_STATES, 
  GROUP_PROJECT_PHASES, 
  REQUIREMENT_STATUSES, 
  FUNCTIONALITY_TEST_STATUSES, 
  MODIFICATION_STATUSES 
} from './constants';

async function clearCollections() {
  const collections = [
    'vibe_teams', 'vibe_users', 'vibe_monthlyCycles', 'vibe_projects', 
    'vibe_groupContributions', 'vibe_pullRequests', 'vibe_requirements', 
    'vibe_functionalityReviews', 'vibe_modifications', 'vibe_attendanceCache', 
    'vibe_dailyReports', 'vibe_activities'
  ];
  for (const col of collections) {
    const snap = await db.collection(col).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
}

async function main() {
  console.log('Clearing old data...');
  await clearCollections();

  console.log('Seeding Firestore...');

  const teamRef = await db.collection('vibe_teams').add({ name: 'Vibe Coding Team', createdAt: new Date().toISOString() });
  const teamId = teamRef.id;
  
  const pw = bcrypt.hashSync('password', 10);
  
  const leadRef = await db.collection('vibe_users').add({ name: 'Lead User', email: 'lead@demo.com', passwordHash: pw, role: 'team_lead', teamId, active: true, joinedAt: new Date().toISOString() });
  const coLeadRef = await db.collection('vibe_users').add({ name: 'CoLead User', email: 'colead@demo.com', passwordHash: pw, role: 'co_lead', teamId, active: true, joinedAt: new Date().toISOString() });

  const members = [];
  for (let i = 1; i <= 19; i++) {
    const memRef = await db.collection('vibe_users').add({ 
      name: `Member ${i}`, 
      email: `member${i}@demo.com`, 
      registrationNumber: `VC-${2000 + i}`,
      passwordHash: pw, 
      role: 'member', 
      teamId,
      active: true,
      joinedAt: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString()
    });
    members.push({ id: memRef.id, name: `Member ${i}` });
  }

  const now = new Date();
  const cycleRef = await db.collection('vibe_monthlyCycles').add({
    teamId, month: now.getMonth() + 1, year: now.getFullYear(),
    individualStartDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    individualEndDate: new Date(now.getFullYear(), now.getMonth(), 20).toISOString(),
    groupStartDate: new Date(now.getFullYear(), now.getMonth(), 21).toISOString(),
    groupEndDate: new Date(now.getFullYear(), now.getMonth(), 30).toISOString(),
    status: 'active'
  });
  const cycleId = cycleRef.id;

  // 1 Group Project
  const groupProjectRef = await db.collection('vibe_projects').add({
    type: 'group', name: 'Vibe Enterprise System', domain: 'Fullstack', 
    currentPhase: GROUP_PROJECT_PHASES.DEVELOPMENT, memberId: leadRef.id, cycleId
  });

  // Requirements
  for (let i=1; i<=10; i++) {
    await db.collection('vibe_requirements').add({
      groupProjectId: groupProjectRef.id,
      title: `Requirement ${i}`,
      description: `System must support feature ${i}`,
      status: i <= 5 ? REQUIREMENT_STATUSES.VERIFIED : REQUIREMENT_STATUSES.IN_PROGRESS,
      reviewer: leadRef.id,
      verifiedAt: i <= 5 ? new Date().toISOString() : null
    });
  }

  // Functionality Tests
  for (let i=1; i<=5; i++) {
    await db.collection('vibe_functionalityReviews').add({
      groupProjectId: groupProjectRef.id,
      feature: `Feature ${i}`,
      status: i === 3 ? FUNCTIONALITY_TEST_STATUSES.FAIL : FUNCTIONALITY_TEST_STATUSES.PASS,
      notes: i === 3 ? 'Unexpected crash on load' : 'Working as expected',
    });
  }

  // Individual Projects
  const statuses = Object.values(INDIVIDUAL_PROJECT_STATES);
  
  let modCount = 0;

  for (const m of members) {
    for (let i = 0; i < 4; i++) {
      // Randomize statuses to get a realistic spread
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      let gitUrl = ['GITHUB_SUBMISSION', 'VERIFICATION', 'FINAL_VERIFICATION', 'COMPLETED', 'MODIFICATION_REQUESTED', 'RESUBMISSION'].includes(status) 
        ? 'https://github.com/test/repo' 
        : null;

      const pRef = await db.collection('vibe_projects').add({
        type: 'individual', 
        name: `Proj ${i+1} - ${m.name}`, 
        domain: 'Backend', 
        description: 'REST API implementation',
        currentStatus: status, 
        progressPercentage: 50, // This will be calculated by the engine in real time
        githubUrl: gitUrl, 
        memberId: m.id, 
        cycleId, 
        createdAt: new Date().toISOString()
      });

      if (status === 'MODIFICATION_REQUESTED') {
        await db.collection('vibe_modifications').add({
          projectId: pRef.id,
          assignedTo: m.id,
          issue: 'Fix security vulnerability',
          severity: 'HIGH',
          status: MODIFICATION_STATUSES.OPEN,
          requestedAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString() // 4 days ago -> OVERDUE
        });
        modCount++;
      }
    }

    // Group Contributions & Activities
    // Randomize so some members have none, making them inactive
    const numCommits = Math.floor(Math.random() * 10);
    if (numCommits > 0) {
      const cRef = await db.collection('vibe_groupContributions').add({
        task: `Component Dev for ${m.name}`, 
        status: 'completed', 
        projectId: groupProjectRef.id, 
        memberId: m.id
      });
      
      await db.collection('vibe_pullRequests').add({
        contributionId: cRef.id,
        prUrl: 'https://github.com/pr',
        status: 'merged'
      });

      for (let c = 0; c < numCommits; c++) {
        await db.collection('vibe_activities').add({
          type: 'COMMIT',
          memberId: m.id,
          projectId: groupProjectRef.id,
          message: 'Pushed code',
          timestamp: new Date().toISOString()
        });
      }
    }

    for (let d = 1; d <= 25; d++) {
      await db.collection('vibe_attendanceCache').add({
        date: new Date(now.getFullYear(), now.getMonth(), d).toISOString(),
        status: Math.random() > 0.15 ? 'present' : 'absent',
        memberId: m.id
      });
    }
  }

  console.log(`Seeded ${modCount} open modifications.`);
}

main()
  .then(() => {
    console.log('Seed completed.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
