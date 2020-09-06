import { useEffect, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { StatsReport } from 'twilio-video';

//  Returns the stats report while connected to a Room
export default function useStatsReport() {
  const { room } = useVideoContext();
  const [statsReport, setStatsReport] = useState<StatsReport[]>([]);

  console.log('updateStatsReport');

  useEffect(() => {
    const updateStatsReport = () => {
      if (room.state === 'connected') {
        room.getStats().then(function(result) {
          if (result !== undefined) {
            console.log(result);
            setStatsReport(result);
          }
        });
      }
      if (room.state !== 'disconnected') {
        setTimeout(function() {
          updateStatsReport();
        }, 5000);
      }
    };

    updateStatsReport();
  }, [room]);

  return statsReport;
}
