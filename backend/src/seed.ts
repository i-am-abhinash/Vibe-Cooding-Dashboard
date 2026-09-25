import { db } from './firebase';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding Firestore...');

  const teamRef = await db.collection('vibe_teams').add({ name: 'Vibe Coding Team', createdAt: new Date().toISOString() });
  const teamId = teamRef.id;
  
  const pw = bcrypt.hashSync('password', 10);
  
  const leadRef = await db.collection('vibe_users').add({ name: 'Lead User', email: 'lead@demo.com', passwordHash: pw, role: 'team_lead', teamId });
  const coLeadRef = await db.collection('vibe_users').add({ name: 'CoLead User', email: 'colead@demo.com', passwordHash: pw, role: 'co_lead', teamId });

  const members = [];
  for (let i = 1; i <= 5; i++) {
    const memRef = await db.collection('vibe_users').add({ name: `Member ${i}`, email: `member${i}@demo.com`, passwordHash: pw, role: 'member', teamId });
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

  const statuses = [
    'idea_submitted', 'idea_approved', 'in_progress', 'pending_verification', 'modification_required', 'resubmitted', 'verified', 'completed'
  ];

  const groupProjectRef = await db.collection('vibe_projects').add({
    type: 'group', name: 'Dashboard App', domain: 'Fullstack', expectedOutcome: 'Production app',
    ideaStatus: 'approved', status: 'in_progress', memberId: leadRef.id, cycleId
  });

  let j = 0;
  for (const m of members) {
    for (let i = 0; i < 4; i++) {
      const status = statuses[j % statuses.length];
      j++;
      
      let gitUrl = ['pending_verification', 'modification_required', 'resubmitted', 'verified', 'completed'].includes(status) ? 'https://github.com/test/repo' : null;

      await db.collection('vibe_projects').add({
        type: 'individual', name: `Proj ${i} - ${m.name}`, domain: 'Backend', expectedOutcome: 'API',
        ideaStatus: ['idea_submitted'].includes(status) ? 'submitted' : 'approved',
        status, githubUrl: gitUrl, memberId: m.id, cycleId, createdAt: new Date().toISOString()
      });
    }

    await db.collection('vibe_groupContributions').add({
      task: `Task for ${m.name}`, githubUrl: 'https://github.com/test', branch: 'feat',
      status: 'contribution_submitted', projectId: groupProjectRef.id, memberId: m.id
    });

    for (let d = 1; d <= 15; d++) {
      await db.collection('vibe_attendanceCache').add({
        date: new Date(now.getFullYear(), now.getMonth(), d).toISOString(),
        status: Math.random() > 0.1 ? 'present' : 'absent',
        memberId: m.id
      });
    }

    await db.collection('vibe_dailyReports').add({
      date: new Date().toISOString(), workCompleted: 'Did some coding', memberId: m.id
    });
  }
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
