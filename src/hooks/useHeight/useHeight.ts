import { useState } from 'react';
import { isMobile } from '../../utils';

export default function useHeight() {
  const getHeight = () => window.innerHeight * (window.visualViewport?.scale || 1);
  const getIsPortrait = () => window.visualViewport.height > window.visualViewport.width;

  const [height, setHeight] = useState(getHeight());
  const [isPortrait, setIsPortrait] = useState(getIsPortrait());

  const onResize = () => {
    // on desktop the window can be resized, so we should always setHeight when it is resized
    // on mobile, visualViewport.onresize is triggered by either rotating the device or pinch-zooming
    // we ONLY want to setHeight when it is rotated, otherwise pinch-zoom would be broken for the user
    const isNowPortrait = getIsPortrait();
    const deviceWasRotated = isPortrait !== isNowPortrait;

    if (deviceWasRotated) {
      setHeight(getHeight());
      window.scrollTo(0, 0);
      setIsPortrait(isNowPortrait);
    } else if (!isMobile) {
      setHeight(getHeight());
    }
  };

  window.visualViewport.onresize = onResize;

  return height + 'px';
}
