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

  const latency = testReport.stats.rtt?.average;
  const jitter = testReport.stats.jitter.average;
  const packetLoss = testReport.stats.packetLoss.average;

  return Math.min(
    getSingleNetworkCondition(latency, 200, 400),
    getSingleNetworkCondition(jitter, 30, 100),
    getSingleNetworkCondition(packetLoss, 3, 7)
  ) as NetworkCondition;
}
