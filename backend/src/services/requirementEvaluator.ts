import { REQUIREMENT_STATUSES } from '../constants';

export const evaluateRequirements = (requirements: any[]) => {
  const total = requirements.length;
  const verified = requirements.filter(r => r.status === REQUIREMENT_STATUSES.VERIFIED).length;
  const failed = requirements.filter(r => r.status === REQUIREMENT_STATUSES.FAILED).length;
  const inProgress = requirements.filter(r => [REQUIREMENT_STATUSES.IN_PROGRESS, REQUIREMENT_STATUSES.SUBMITTED].includes(r.status)).length;
  const pending = requirements.filter(r => r.status === REQUIREMENT_STATUSES.NOT_STARTED).length;
  const modificationRequired = requirements.filter(r => r.status === REQUIREMENT_STATUSES.MODIFICATION_REQUIRED).length;

  const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;

  return {
    requirementsTotal: total,
    requirementsCompleted: verified, // verified means fully completed
    requirementsVerified: verified,
    requirementsFailed: failed,
    requirementsPending: pending,
    requirementsModificationRequired: modificationRequired,
    requirementsInProgress: inProgress,
    requirementSatisfactionPercentage: percentage
  };
};
