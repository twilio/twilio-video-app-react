import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import EndCallButton from './EndCallButton/EndCallButton';
import ToggleAudioButton from './ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton/ToggleVideoButton';
import { ROOM_STATE } from '../../utils/displayStrings';
import useIsUserActive from './useIsUserActive/useIsUserActive';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useIsHostIn from '../../hooks/useIsHosetIn/useIsHostIn';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      position: 'absolute',
      right: '50%',
      transform: 'translate(50%, 30px)',
      bottom: '50px',
      zIndex: 1,
      transition: 'opacity 1.2s, transform 1.2s, visibility 0s 1.2s',
      opacity: 0,
      visibility: 'hidden',
      maxWidth: 'min-content',
      '&.showControls, &:hover': {
        transition: 'opacity 0.6s, transform 0.6s, visibility 0s',
        opacity: 1,
        visibility: 'visible',
        transform: 'translate(50%, 0px)',
      },
      [theme.breakpoints.down('xs')]: {
        bottom: `${theme.sidebarMobileHeight + 3}px`,
      },
    },
  })
);

export default function Controls() {
  const classes = useStyles();
  const roomState = useRoomState();
  const isReconnecting = roomState === ROOM_STATE.RECONNECTING;
  const isdisconnected = roomState === ROOM_STATE.DISCONNECTED;
  const isUserActive = useIsUserActive();
  const showControls = isUserActive || roomState === ROOM_STATE.DISCONNECTED;
  const enableButtons = isReconnecting ? isReconnecting : isdisconnected ? false : false /*!useIsHostIn()*/;

  return (
    <div className={clsx(classes.container, { showControls })}>
      <ToggleAudioButton disabled={enableButtons} />
      <ToggleVideoButton disabled={enableButtons} />
      {roomState !== ROOM_STATE.DISCONNECTED && (
        <>
          <EndCallButton />
        </>
      )}
    </div>
  );
}
