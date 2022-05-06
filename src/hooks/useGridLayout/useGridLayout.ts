import throttle from 'lodash.throttle';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GRID_MODE_ASPECT_RATIO, GRID_MODE_MARGIN } from '../../constants';

/**
 * This function determines how many columns and rows are to be used
 * for the grid layout given a specific video size.
 */

function layoutIsTooSmall(
  newVideoSize: number,
  participantCount: number,
  containerWidth: number,
  containerHeight: number
) {
  const videoWidth = newVideoSize;
  const videoHeight = newVideoSize * GRID_MODE_ASPECT_RATIO;

  const columns = Math.floor(containerWidth / videoWidth);
  const rows = Math.ceil(participantCount / columns);

  // Return true if the new grid size is taller than or equal to the app's container:
  return rows * videoHeight >= containerHeight;
}

/**
 * This hook returns the appropriate width for each participant's video and a ref
 * to be used for the app's container. The actual layout is determined by CSS Flexbox.
 * This ensures that the grid of participants' videos will always fit within the given screen size.
 */

export default function useGridLayout(participantCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [participantVideoWidth, setParticipantVideoWidth] = useState(0);

  const updateLayout = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth - GRID_MODE_MARGIN * 2;
    const containerHeight = containerRef.current.offsetHeight - GRID_MODE_MARGIN * 2;

    // Here we try to guess the new size of each video by increasing the width .
    // Once layoutIsTooSmall becomes false, we have found the correct video width:
    let lowestVideoWidthGuess = 0;
    let highestVideoWidthGuess = Number.MAX_SAFE_INTEGER;
    let prevGuessTooHigh = false;

    // what is this condition?
    while (highestVideoWidthGuess > 2 ** -2) {
      const isHigher = layoutIsTooSmall(lowestVideoWidthGuess, participantCount, containerWidth, containerHeight);
      lowestVideoWidthGuess += isHigher ? -highestVideoWidthGuess : highestVideoWidthGuess;
      if (isHigher !== prevGuessTooHigh) {
        highestVideoWidthGuess /= 2;
      }
      prevGuessTooHigh = isHigher;
    }

    let newParticipantVideoWidth = Math.floor(lowestVideoWidthGuess);

    setParticipantVideoWidth(newParticipantVideoWidth - GRID_MODE_MARGIN * 2);
  }, [participantCount]);

  useEffect(() => {
    const observer = new window.ResizeObserver(throttle(updateLayout, 60));
    observer.observe(containerRef.current!);
    return () => {
      observer.disconnect();
    };
  }, [updateLayout]);

  useLayoutEffect(updateLayout, [updateLayout]);

  return {
    participantVideoWidth,
    containerRef,
  };
}
