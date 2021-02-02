import { useEffect, useState } from 'react';

import useVideoContext from '../useVideoContext/useVideoContext';

export default function useMos() {
  const { room } = useVideoContext();
  const [mosScore, setMosScore] = useState(room.mosScore);

  useEffect(() => {
    const handleMosChange = () => setMosScore(room.mosScore);

    setMosScore(room.mosScore);
    room.addListener('mosScoreChanged', handleMosChange);
    return () => {
      room.off('mosScoreChanged', handleMosChange);
    };
  }, [room]);

  return mosScore;
}
