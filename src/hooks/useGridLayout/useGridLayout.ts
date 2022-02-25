import { debounce } from '@material-ui/core';
import throttle from 'lodash.throttle';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const ASPECT_RATIO = 9 / 16;
export const MARGIN = 3;

/**
 * This function determines how many columns and rows are to be used
 * for the grid layout given a specific video size.
 */

export const layoutIsTooSmall = (
  newVideoSize: number,
  participantCount: number,
  containerWidth: number,
  containerHeight: number
) => {
  const videoWidth = newVideoSize;
  const videoHeight = newVideoSize * ASPECT_RATIO;

  const columns = Math.floor(containerWidth / videoWidth);
  const rows = Math.ceil(participantCount / columns);

  // Return false if the new grid size is taller than the app's container:
  return rows * videoHeight <= containerHeight;
};

/**
 * This hook returns the appropriate width for each participant's video and a ref
 * to be used for the app's container. The actual layout is determined by CSS Flexbox.
 * This ensures that the grid of participants' videos will always fit within the given screen size.
 */

export default function useGridLayout(participantCount: number, isPresentationModeActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [participantVideoWidth, setParticipantVideoWidth] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(throttle(updateLayout, 20));
    observer.observe(containerRef.current!);
    return () => {
      observer.disconnect();
    };
  }, [participantCount]);

  const updateLayout = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth - MARGIN * 2;
    const containerHeight = containerRef.current.offsetHeight - MARGIN * 2;
    console.log(participantCount, containerWidth, containerHeight);

    let newParticipantVideoWidth = 1;

    // Here we try to guess the new size of each video by increasing the width by 1.
    // Once layoutIsTooSmall becomes false, we have found the correct video width:
    while (layoutIsTooSmall(newParticipantVideoWidth + 1, participantCount, containerWidth, containerHeight)) {
      newParticipantVideoWidth++;
    }

    setParticipantVideoWidth(newParticipantVideoWidth - MARGIN * 2);
  };

  useLayoutEffect(updateLayout, [participantCount, isPresentationModeActive]);

  return {
    participantVideoWidth,
    containerRef,
  };
}
