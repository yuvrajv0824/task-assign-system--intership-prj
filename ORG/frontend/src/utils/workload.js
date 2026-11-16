/**
 * Workload Utility
 * Formula: Hours = Points * 4
 * Capacity Threshold: 40 hours per week
 */
export function calculateWorkload(storyPoints = 0, maxHours = 40) {
  const hours = storyPoints * 4;
  const percent = maxHours > 0 ? Math.round((hours / maxHours) * 100) : 0;
  const isOverload = hours > maxHours;
  const isBurnoutRisk = hours >= 48;

  let status = 'OPTIMAL';
  if (isOverload) {
    status = 'OVERLOAD';
  } else if (hours >= maxHours * 0.75) {
    status = 'HIGH';
  } else if (hours === 0) {
    status = 'AVAILABLE';
  }

  return {
    points: storyPoints,
    hours,
    maxHours,
    percent,
    isOverload,
    isBurnoutRisk,
    status,
  };
}

