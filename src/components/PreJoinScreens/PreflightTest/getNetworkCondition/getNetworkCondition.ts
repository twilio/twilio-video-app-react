import { NetworkCondition } from '../PreflightTest';
import { PreflightTestReport } from '../../../../types';

export function getSingleNetworkCondition(stat: number | undefined, yellowThreshold: number, redThreshold: number) {
  if (typeof stat === 'undefined') {
    // We ignore values that are missing
    return NetworkCondition.Green;
  }

  if (stat >= redThreshold) return NetworkCondition.Red;
  if (stat >= yellowThreshold) return NetworkCondition.Yellow;
  return NetworkCondition.Green;
}

export default function getNetworkCondition(testReport?: PreflightTestReport) {
  if (!testReport) return undefined;

  return Math.min(
    getSingleNetworkCondition(testReport.stats.rtt?.average, 200, 400),
    getSingleNetworkCondition(testReport.stats.jitter.average, 30, 100),
    getSingleNetworkCondition(testReport.stats.packetLoss.average, 3, 7)
  ) as NetworkCondition;
}
