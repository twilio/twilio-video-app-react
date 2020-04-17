import { isMobile } from '../../../utils';
import { useEffect, useRef } from 'react';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function AttachVisibilityHandler() {
  const { room } = useVideoContext();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const shouldRepublishVideoOnForeground = useRef(false);

  useEffect(() => {
    if (isMobile) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && isVideoEnabled) {
          shouldRepublishVideoOnForeground.current = true;
          toggleVideoEnabled();
        } else if (shouldRepublishVideoOnForeground.current) {
          shouldRepublishVideoOnForeground.current = false;
          toggleVideoEnabled();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isVideoEnabled, room, toggleVideoEnabled]);

  return null;
}
