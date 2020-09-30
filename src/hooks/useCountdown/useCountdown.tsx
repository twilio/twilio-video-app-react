import { useEffect, useState } from 'react';
import { useAppState } from '../../state'

export default function useCountdown() {
  const { roomEndTime } = useAppState()

  const calculateTimeLeft = () => {
    let timeLeft = {};
    // + is a shorthand to tell javascript cast the object as a integer

    const difference = +new Date(roomEndTime) - +new Date();
    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    } else {
      timeLeft = {
        minutes: 0,
        seconds: 0
      }
    }
    return timeLeft;
  }
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  return timeLeft
}
