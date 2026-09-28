import { ATTENTION_SEVERITIES, INDIVIDUAL_PROJECT_STATES, REQUIREMENT_STATUSES, FUNCTIONALITY_TEST_STATUSES, MODIFICATION_STATUSES } from '../constants';

export const detectAttentionItems = (
  projects: any[],
  groupProject: any,
  requirements: any[],
  tests: any[],
  modifications: any[],
  members: any[],
  participationMap: Record<string, any>
) => {
  const attentionItems = [];

  // 1. Individual Projects without GitHub
  projects.forEach(p => {
    if (
      p.currentStatus === INDIVIDUAL_PROJECT_STATES.GITHUB_SUBMISSION || 
      p.currentStatus === INDIVIDUAL_PROJECT_STATES.VERIFICATION || 
      p.currentStatus === INDIVIDUAL_PROJECT_STATES.FINAL_VERIFICATION
    ) {
      if (!p.githubUrl) {
        attentionItems.push({
          type: 'MISSING_EVIDENCE',
          severity: ATTENTION_SEVERITIES.HIGH,
          memberId: p.memberId,
          projectId: p.id,
          title: `Project ${p.name || p.id.slice(-4)} Missing Repository`,
          description: 'Project is in verification stages but no GitHub URL was submitted.',
          reason: 'A valid repository is required for verification.',
          createdAt: new Date().toISOString(),
          status: 'OPEN'
        });
      }
    }
  });

  // 2. Overdue or unresolved modifications
  modifications.forEach(m => {
    if (m.status === MODIFICATION_STATUSES.OPEN || m.status === MODIFICATION_STATUSES.IN_PROGRESS) {
      const daysOpen = (new Date().getTime() - new Date(m.requestedAt || m.createdAt).getTime()) / (1000 * 3600 * 24);
      if (daysOpen > 3) {
        attentionItems.push({
          type: 'OVERDUE_MODIFICATION',
          severity: ATTENTION_SEVERITIES.CRITICAL,
          memberId: m.assignedTo || null,
          projectId: m.projectId,
          title: `Overdue Modification for ${m.projectId.slice(-4)}`,
          description: `Modification request has been unresolved for ${Math.round(daysOpen)} days.`,
          reason: 'Blocks final verification.',
          createdAt: new Date().toISOString(),
          status: 'OPEN'
        });
      }
    }
  });

  // 3. Failed Requirements
  requirements.forEach(r => {
    if (r.status === REQUIREMENT_STATUSES.FAILED || r.status === REQUIREMENT_STATUSES.MODIFICATION_REQUIRED) {
      attentionItems.push({
        type: 'REQUIREMENT_FAILED',
        severity: ATTENTION_SEVERITIES.HIGH,
        projectId: r.groupProjectId,
        title: `Requirement Failed: ${r.title || r.id.slice(-4)}`,
        description: 'A group project requirement failed verification.',
        reason: r.reviewerComment || 'Reviewer flagged issues.',
        createdAt: new Date().toISOString(),
        status: 'OPEN'
      });
    }
  });

  // 4. Failed Functionality Tests
  tests.forEach(t => {
    if (t.status === FUNCTIONALITY_TEST_STATUSES.FAIL || t.status === FUNCTIONALITY_TEST_STATUSES.BLOCKED) {
      attentionItems.push({
        type: 'TEST_FAILED',
        severity: ATTENTION_SEVERITIES.CRITICAL,
        projectId: t.groupProjectId,
        title: `Functionality Test Failed`,
        description: `Test "${t.feature}" failed execution.`,
        reason: t.notes || 'Unexpected behavior detected.',
        createdAt: new Date().toISOString(),
        status: 'OPEN'
      });
    }
  });

  // 5. Inactive Members
  members.forEach(m => {
    const part = participationMap[m.id];
    if (part && !part.active) {
      const daysInactive = part.lastActivityAt 
        ? (new Date().getTime() - new Date(part.lastActivityAt).getTime()) / (1000 * 3600 * 24)
        : 999;
      
      if (daysInactive > 7) {
        attentionItems.push({
          type: 'INACTIVE_MEMBER',
          severity: ATTENTION_SEVERITIES.MEDIUM,
          memberId: m.id,
          title: `Inactive Member: ${m.name}`,
          description: `No group contribution for ${daysInactive === 999 ? 'the entire cycle' : Math.round(daysInactive) + ' days'}.`,
          reason: 'Group project participation is mandatory.',
          createdAt: new Date().toISOString(),
          status: 'OPEN'
        });
      }
    }
  });

  return attentionItems;
};
