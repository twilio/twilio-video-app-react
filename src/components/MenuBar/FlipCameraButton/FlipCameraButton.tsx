import React, { useCallback, useEffect, useState } from 'react';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import { IconButton } from '@material-ui/core';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function FlipCameraButton() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
  } = useVideoContext();
  const [supportsFacingMode, setSupportsFacingMode] = useState<Boolean | null>(null);
  const videoTrack = localTracks.find(track => track.name === 'camera');
  const facingMode = videoTrack?.mediaStreamTrack.getSettings().facingMode;

  useEffect(() => {
    // The 'supportsFacingMode' variable determines if this component is rendered
    // If facingMode is true, we will set supportsFacingMode to true.
    // However, if facingMode is ever false again (when the user unpublishes video), we
    // won't set 'supportsFacingMode' to false. This prevents the icon from briefly
    // disappearing when the user switches their front/rear camera.
    if (facingMode && supportsFacingMode === null) {
      setSupportsFacingMode(Boolean(facingMode));
    }
  }, [facingMode, supportsFacingMode]);

  const toggleFacingMode = useCallback(() => {
    const localTrackPublication = localParticipant?.unpublishTrack(videoTrack!);
    // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
    localParticipant?.emit('trackUnpublished', localTrackPublication);
    videoTrack!.stop();

    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';

    getLocalVideoTrack(newFacingMode).then(newVideoTrack => {
      localParticipant?.publishTrack(newVideoTrack, { priority: 'low' });
    });
  }, [facingMode, getLocalVideoTrack, localParticipant, videoTrack]);

  return supportsFacingMode ? (
    <IconButton onClick={toggleFacingMode} disabled={!videoTrack}>
      <FlipCameraIosIcon />
    </IconButton>
  ) : null;
}