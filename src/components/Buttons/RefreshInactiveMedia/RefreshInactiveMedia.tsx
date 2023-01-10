import React from 'react';
import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function RefreshInactiveMedia() {
  const { room } = useVideoContext();
  const refreshInactiveMedia = () => room?.refreshInactiveMedia();

  return <Button onClick={refreshInactiveMedia}>Refresh Media</Button>;
}
