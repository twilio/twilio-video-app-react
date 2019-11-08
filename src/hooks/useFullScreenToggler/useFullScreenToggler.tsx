import { useCallback, useState, useEffect } from 'react';
import fscreen from 'fscreen';

const getIsFullScreen = () => !!fscreen.fullscreenElement;

export default function useFullScreenToggler() {
  const [isFullScreen, setIsFullScreen] = useState<Boolean>(getIsFullScreen());

  useEffect(() => {
    const onFullScreenChange = () => setIsFullScreen(getIsFullScreen());
    fscreen.addEventListener('fullscreenchange', onFullScreenChange);
    return () => {
      fscreen.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, []);

  const toggleFullScreen = useCallback(() => {
    isFullScreen ? fscreen.exitFullscreen() : fscreen.requestFullscreen(document.documentElement);
  }, [isFullScreen]);

  return [isFullScreen, toggleFullScreen] as const;
}
