export const calculateGroupParticipation = (memberId: string, groupProjectId: string, activities: any[], contributions: any[], prs: any[]) => {
  const memberActivities = activities.filter(a => a.memberId === memberId && (a.projectId === groupProjectId || a.targetId === groupProjectId));
  const memberContributions = contributions.filter(c => c.memberId === memberId && c.projectId === groupProjectId);
  const memberPRs = prs.filter(p => memberContributions.some(c => c.id === p.contributionId));

  const evidence = [];
  const missingEvidence = [];

  let commitsCount = 0;
  let reviewsCount = 0;
  let tasksCompleted = 0;
  let requirementsContributed = 0;

  // Process activities
  memberActivities.forEach(a => {
    if (a.type === 'COMMIT') commitsCount++;
    if (a.type === 'REVIEW') reviewsCount++;
    if (a.type === 'REQUIREMENT_CONTRIBUTION') requirementsContributed++;
  });

  tasksCompleted = memberContributions.filter(c => c.status === 'completed' || c.status === 'verified').length;

  if (commitsCount > 0) evidence.push(`${commitsCount} commits`);
  else missingEvidence.push('No commits found');

  if (memberPRs.length > 0) evidence.push(`${memberPRs.length} PRs`);
  else missingEvidence.push('No pull requests submitted');

  if (reviewsCount > 0) evidence.push(`${reviewsCount} code reviews`);
  if (tasksCompleted > 0) evidence.push(`${tasksCompleted} tasks completed`);
  if (requirementsContributed > 0) evidence.push(`Contributed to ${requirementsContributed} requirements`);

  const contributionCount = commitsCount + memberPRs.length + reviewsCount + tasksCompleted + requirementsContributed;

  // Configuration thresholds
  const THRESHOLDS = {
    ACTIVE_MIN_CONTRIBUTIONS: 3
  };

  const isActive = contributionCount >= THRESHOLDS.ACTIVE_MIN_CONTRIBUTIONS;
  
  // Fake percentage just for analytics, capped at 100
  const participationPercentage = Math.min(100, Math.round((contributionCount / 10) * 100));

  let lastActivityAt = null;
  if (memberActivities.length > 0) {
    // Sort descending
    memberActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    lastActivityAt = memberActivities[0].timestamp;
  }

  return {
    active: isActive,
    participationPercentage,
    evidence,
    missingEvidence,
    lastActivityAt,
    contributionCount,
    details: {
      commits: commitsCount,
      pullRequests: memberPRs.length,
      reviews: reviewsCount,
      tasksCompleted,
      requirementsContributed
    }
  };
};
