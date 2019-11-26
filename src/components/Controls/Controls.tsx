import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import EndCallButton from './EndCallButton/EndCallButton';
import ToggleAudioButton from './ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton/ToggleVideoButton';
import ToggleScreenShareButton from './ToogleScreenShareButton/ToggleScreenShareButton';

import useRoomState from '../../hooks/useRoomState/useRoomState';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      right: '50%',
      transform: 'translateX(50%)',
      bottom: '50px',
      zIndex: 1,
    },
  })
);

export default function Controls() {
  const classes = useStyles();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';

  return (
    <div className={classes.container}>
      <ToggleAudioButton disabled={isReconnecting} />
      <ToggleVideoButton disabled={isReconnecting} />
      {roomState !== 'disconnected' && (
        <>
          <ToggleScreenShareButton disabled={isReconnecting} />
          <EndCallButton />
        </>
      )}
    </div>
  );
}
