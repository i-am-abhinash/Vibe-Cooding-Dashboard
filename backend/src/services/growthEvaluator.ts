import { INDIVIDUAL_PROJECT_STATES } from '../constants';

export const calculateMemberGrowth = (
  memberId: string, 
  period: string, 
  projects: any[], 
  participation: any, 
  attendance: any[], 
  modifications: any[]
) => {
  const individualProjectsCompleted = projects.filter(p => p.status === INDIVIDUAL_PROJECT_STATES.COMPLETED).length;
  const individualProjectProgress = projects.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / (projects.length || 1);
  
  const presentDays = attendance.filter(a => a.status === 'present').length;
  const attendancePct = attendance.length > 0 ? (presentDays / attendance.length) * 100 : 0;
  
  const completedModifications = modifications.filter(m => m.status === 'COMPLETED' || m.status === 'VERIFIED').length;
  const totalModifications = modifications.length;
  const modificationContribution = totalModifications > 0 ? (completedModifications / totalModifications) * 100 : 100;

  const growthIndicators = [];
  const blockers = [];

  // Logic to explain growth
  if (individualProjectsCompleted > 0) growthIndicators.push(`${individualProjectsCompleted}/4 individual projects completed`);
  else blockers.push('No individual projects completed yet');

  if (participation.active) growthIndicators.push(`Active group participation (${participation.contributionCount} contributions)`);
  else blockers.push('Low or inactive group project participation');

  if (attendancePct >= 80) growthIndicators.push(`Good attendance (${Math.round(attendancePct)}%)`);
  else blockers.push(`Attendance needs improvement (${Math.round(attendancePct)}%)`);

  if (modifications.length > 0) {
    if (modificationContribution >= 80) growthIndicators.push(`High responsiveness to modification requests`);
    else blockers.push('Slow to address modification requests');
  }

  const score = (
    (individualProjectsCompleted / 4) * 40 +
    (participation.participationPercentage / 100) * 30 +
    (attendancePct / 100) * 20 +
    (modificationContribution / 100) * 10
  );

  let trend = 'STABLE';
  if (score >= 75) trend = 'UPWARD';
  else if (score < 40) trend = 'DOWNWARD';

  let status = 'In Progress';
  if (score >= 85) status = 'Completed';
  else if (score >= 60) status = 'On Track';
  else if (score < 40) status = 'Needs Attention';

  return {
    memberId,
    period,
    individualProjectProgress: Math.round(individualProjectProgress),
    individualProjectsCompleted,
    groupParticipation: participation.active,
    groupContribution: participation.contributionCount,
    requirementContribution: participation.details.requirementsContributed,
    functionalityContribution: 0, // Placeholder if tests linked to member
    modificationContribution: Math.round(modificationContribution),
    attendance: Math.round(attendancePct),
    consistency: score >= 60 ? 'High' : 'Low',
    growthIndicators,
    blockers,
    evidence: [...growthIndicators, ...blockers],
    trend,
    status
  };
};
