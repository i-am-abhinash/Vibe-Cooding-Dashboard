import { FUNCTIONALITY_TEST_STATUSES } from '../constants';

export const evaluateFunctionality = (tests: any[]) => {
  const total = tests.length;
  const passed = tests.filter(t => t.status === FUNCTIONALITY_TEST_STATUSES.PASS).length;
  const failed = tests.filter(t => t.status === FUNCTIONALITY_TEST_STATUSES.FAIL).length;
  const blocked = tests.filter(t => t.status === FUNCTIONALITY_TEST_STATUSES.BLOCKED).length;
  const notTested = tests.filter(t => t.status === FUNCTIONALITY_TEST_STATUSES.NOT_TESTED).length;

  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return {
    totalTests: total,
    passedTests: passed,
    failedTests: failed,
    blockedTests: blocked,
    notTested: notTested,
    functionalityPassRate: passRate
  };
};
