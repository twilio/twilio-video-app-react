import { useCallback, useState } from 'react';
import watchRTC from '@testrtc/watchrtc-sdk';

export default function useStatsListener() {
  const [isStatsEnabled, setIsStatsEnabled] = useState(false);
  const [stats, setStats] = useState(null);

  const statsListener = (statsReceived: any) => {
    setStats(statsReceived);
  };

  const toggleStatsListener = useCallback(() => {
    if (!isStatsEnabled && watchRTC) {
      watchRTC.addStatsListener(statsListener);
      setIsStatsEnabled(true);
    } else {
      watchRTC.addStatsListener(null);
      setIsStatsEnabled(false);
    }
  }, [isStatsEnabled]);

  return [isStatsEnabled, stats, toggleStatsListener] as const;
}
