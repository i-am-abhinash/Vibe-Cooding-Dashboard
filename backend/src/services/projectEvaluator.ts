import { INDIVIDUAL_PROJECT_STATES } from '../constants';

export const evaluateIndividualProject = (project: any) => {
  const blockers = [];
  const warnings = [];
  
  if (!project.title || project.title.trim() === '') blockers.push('Missing project title');
  if (!project.description) blockers.push('Missing description');
  
  if (project.currentStatus !== INDIVIDUAL_PROJECT_STATES.COMPLETED) {
    if (!project.githubUrl) blockers.push('GitHub repository is missing');
    if (!project.reviewer) blockers.push('Project has not been reviewed');
  }

  // Evaluate if modifications are pending
  if (project.currentStatus === INDIVIDUAL_PROJECT_STATES.MODIFICATION_REQUESTED) {
    blockers.push('Modifications are pending');
  }

  let isCompleted = false;
  let percentage = 0;

  switch (project.currentStatus) {
    case INDIVIDUAL_PROJECT_STATES.IDEA: percentage = 10; break;
    case INDIVIDUAL_PROJECT_STATES.PLANNING: percentage = 20; break;
    case INDIVIDUAL_PROJECT_STATES.DEVELOPMENT: percentage = 40; break;
    case INDIVIDUAL_PROJECT_STATES.DOCUMENTATION: percentage = 50; break;
    case INDIVIDUAL_PROJECT_STATES.GITHUB_SUBMISSION: percentage = 60; break;
    case INDIVIDUAL_PROJECT_STATES.VERIFICATION: percentage = 70; break;
    case INDIVIDUAL_PROJECT_STATES.MODIFICATION_REQUESTED: percentage = 65; break;
    case INDIVIDUAL_PROJECT_STATES.RESUBMISSION: percentage = 80; break;
    case INDIVIDUAL_PROJECT_STATES.FINAL_VERIFICATION: percentage = 90; break;
    case INDIVIDUAL_PROJECT_STATES.COMPLETED: 
      percentage = 100;
      isCompleted = true;
      break;
    default:
      percentage = 0;
  }

  if (isCompleted && blockers.length > 0) {
    warnings.push('Project marked completed but has missing requirements');
    isCompleted = false; // Override invalid completions
  }

  return {
    completed: isCompleted,
    percentage,
    currentStage: project.currentStatus,
    blockers,
    warnings,
    evidence: {
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      documentationUrl: project.documentationUrl
    }
  };
};

export const getValidTransitions = (currentStatus: string): string[] => {
  switch (currentStatus) {
    case INDIVIDUAL_PROJECT_STATES.IDEA:
      return [INDIVIDUAL_PROJECT_STATES.PLANNING];
    case INDIVIDUAL_PROJECT_STATES.PLANNING:
      return [INDIVIDUAL_PROJECT_STATES.DEVELOPMENT];
    case INDIVIDUAL_PROJECT_STATES.DEVELOPMENT:
      return [INDIVIDUAL_PROJECT_STATES.DOCUMENTATION, INDIVIDUAL_PROJECT_STATES.GITHUB_SUBMISSION];
    case INDIVIDUAL_PROJECT_STATES.DOCUMENTATION:
      return [INDIVIDUAL_PROJECT_STATES.GITHUB_SUBMISSION];
    case INDIVIDUAL_PROJECT_STATES.GITHUB_SUBMISSION:
      return [INDIVIDUAL_PROJECT_STATES.VERIFICATION];
    case INDIVIDUAL_PROJECT_STATES.VERIFICATION:
      return [INDIVIDUAL_PROJECT_STATES.FINAL_VERIFICATION, INDIVIDUAL_PROJECT_STATES.MODIFICATION_REQUESTED];
    case INDIVIDUAL_PROJECT_STATES.MODIFICATION_REQUESTED:
      return [INDIVIDUAL_PROJECT_STATES.RESUBMISSION];
    case INDIVIDUAL_PROJECT_STATES.RESUBMISSION:
      return [INDIVIDUAL_PROJECT_STATES.FINAL_VERIFICATION, INDIVIDUAL_PROJECT_STATES.MODIFICATION_REQUESTED];
    case INDIVIDUAL_PROJECT_STATES.FINAL_VERIFICATION:
      return [INDIVIDUAL_PROJECT_STATES.COMPLETED, INDIVIDUAL_PROJECT_STATES.MODIFICATION_REQUESTED];
    case INDIVIDUAL_PROJECT_STATES.COMPLETED:
      return [];
    default:
      return [];
  }
};
