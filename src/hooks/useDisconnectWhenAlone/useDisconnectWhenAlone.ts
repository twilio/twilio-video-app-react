import { useRef, useEffect } from 'react';
import useParticipants from '../useParticipants/useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useDisconnectWhenAlone() {
  const { room } = useVideoContext();
  const participants = useParticipants();
  const timeoutIdRef = useRef<number>();

  useEffect(() => {
    if (participants.length === 0) {
      timeoutIdRef.current = window.setTimeout(() => room.disconnect(), 20000);
    } else {
      window.clearTimeout(timeoutIdRef.current);
    }
    return () => {
      window.clearTimeout(timeoutIdRef.current);
    };
  }, [participants, room]);
}
