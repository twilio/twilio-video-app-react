import { useCallback, useState, useEffect } from 'react';
import fscreen from 'fscreen';

const _isFullScreen = () => !!fscreen.fullscreenElement;

export default function useFullScreenToggler() {
  const [isFullScreen, _setIsFullScreen] = useState<Boolean>(_isFullScreen());

  useEffect(() => {
    const setIsFullscreen = () => _setIsFullScreen(_isFullScreen());
    fscreen.addEventListener('fullscreenchange', setIsFullscreen);
    return () => {
      fscreen.removeEventListener('fullscreenchange', setIsFullscreen);
    };
  }, []);

  const toggleFullScreen = useCallback(() => {
    isFullScreen ? fscreen.exitFullscreen() : fscreen.requestFullscreen(document.documentElement);
  }, [isFullScreen]);

  return [isFullScreen, toggleFullScreen] as const;
}
