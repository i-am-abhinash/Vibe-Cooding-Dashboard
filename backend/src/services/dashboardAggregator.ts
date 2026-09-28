import { evaluateIndividualProject } from './projectEvaluator';
import { evaluateRequirements } from './requirementEvaluator';
import { evaluateFunctionality } from './functionalityEvaluator';
import { calculateGroupParticipation } from './participationEvaluator';
import { calculateMemberGrowth } from './growthEvaluator';
import { detectAttentionItems } from './attentionEvaluator';
import { INDIVIDUAL_PROJECT_STATES } from '../constants';

export const buildTeamDashboard = async (
  teamId: string,
  cycleId: string,
  members: any[],
  individualProjects: any[],
  groupProject: any,
  groupRequirements: any[],
  groupTests: any[],
  modifications: any[],
  activities: any[],
  contributions: any[],
  prs: any[],
  attendance: any[]
) => {
  
  const participationMap: Record<string, any> = {};
  const growthMap: Record<string, any> = {};
  
  let individualProjectsCompleted = 0;
  let activeParticipants = 0;
  
  members.forEach(m => {
    const memProjects = individualProjects.filter(p => p.memberId === m.id);
    const completedCount = memProjects.filter(p => p.currentStatus === INDIVIDUAL_PROJECT_STATES.COMPLETED).length;
    individualProjectsCompleted += completedCount;

    const memAtt = attendance.filter(a => a.memberId === m.id);
    const memMods = modifications.filter(mod => memProjects.some(p => p.id === mod.projectId));
    
    const part = calculateGroupParticipation(m.id, groupProject?.id, activities, contributions, prs);
    participationMap[m.id] = part;
    if (part.active) activeParticipants++;

    const growth = calculateMemberGrowth(m.id, cycleId, memProjects, part, memAtt, memMods);
    growthMap[m.id] = growth;
  });

  const reqEval = evaluateRequirements(groupRequirements);
  const funcEval = evaluateFunctionality(groupTests);
  const attentionItems = detectAttentionItems(individualProjects, groupProject, groupRequirements, groupTests, modifications, members, participationMap);
  
  // Calculate Team Progress Formula
  // 40% from individual projects (completion rate)
  // 30% from group requirements
  // 30% from functionality pass rate
  const individualTarget = members.length * 4;
  const indPct = individualTarget > 0 ? (individualProjectsCompleted / individualTarget) * 100 : 0;
  
  const teamProgress = Math.round((indPct * 0.4) + (reqEval.requirementSatisfactionPercentage * 0.3) + (funcEval.functionalityPassRate * 0.3));

  // Team Attendance
  const presentDays = attendance.filter(a => a.status === 'present').length;
  const teamAttendance = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0;

  const membersOnTrack = Object.values(growthMap).filter((g: any) => g.status === 'On Track' || g.status === 'Completed').length;
  const membersNeedingAttention = Object.values(growthMap).filter((g: any) => g.status === 'Needs Attention').length;

  return {
    teamMemberCount: members.length,
    individualProjectsExpected: individualTarget,
    individualProjectsCompleted,
    individualProjectCompletionRate: Math.round(indPct),
    groupProjectProgress: teamProgress, // Overall combined
    groupRequirementSatisfaction: reqEval.requirementSatisfactionPercentage,
    groupFunctionalityPassRate: funcEval.functionalityPassRate,
    activeParticipants,
    inactiveParticipants: members.length - activeParticipants,
    teamAttendance,
    membersOnTrack,
    membersNeedingAttention,
    openModificationCount: modifications.filter(m => m.status === 'OPEN' || m.status === 'IN_PROGRESS').length,
    openRequirementCount: reqEval.requirementsPending,
    recentActivity: activities.slice(0, 10), // Example
    growthTrend: teamProgress > 50 ? 'UPWARD' : 'STABLE', // Simplistic team trend
    attentionItems,
    
    // Detailed views
    membersDetails: members.map(m => ({
      ...m,
      growth: growthMap[m.id],
      participation: participationMap[m.id]
    }))
  };
};

export const buildMemberDashboard = (
  member: any,
  cycleId: string,
  projects: any[],
  groupProject: any,
  activities: any[],
  contributions: any[],
  prs: any[],
  attendance: any[],
  modifications: any[]
) => {
  const memProjects = projects.filter(p => p.memberId === member.id);
  const part = calculateGroupParticipation(member.id, groupProject?.id, activities, contributions, prs);
  const growth = calculateMemberGrowth(member.id, cycleId, memProjects, part, attendance, modifications);

  return {
    profile: member,
    projects: memProjects.map(p => ({
      ...p,
      evaluation: evaluateIndividualProject(p)
    })),
    groupProject: {
      ...groupProject,
      participation: part
    },
    attendance: {
      percentage: growth.attendance,
      trend: 'STABLE'
    },
    growth,
    attention: detectAttentionItems(memProjects, groupProject, [], [], modifications, [member], { [member.id]: part })
  };
};
