import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';

export default function useIsUserActive() {
  const [isUserActive, setIsUserActive] = useState(true);
  const timeoutIDRef = useRef(0);

  useEffect(() => {
    const handleUserActivity = throttle(() => {
      setIsUserActive(true);
      clearTimeout(timeoutIDRef.current);
      const timeoutID = window.setTimeout(() => setIsUserActive(false), 5000);
      timeoutIDRef.current = timeoutID;
    }, 500);

    handleUserActivity();

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearTimeout(timeoutIDRef.current);
    };
  }, []);

  return isUserActive;
}
