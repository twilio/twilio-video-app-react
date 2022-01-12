import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Menu from './Menu/Menu';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography, Grid } from '@material-ui/core';
import ToggleAudioButton from '../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../Buttons/ToggleVideoButton/ToggleVideoButton';
// import useGameContext from '../../hooks/useGameContext/useGameContext';
import useSessionContext from 'hooks/useSessionContext';
import EndCallButton from 'components/Buttons/EndCallButton/EndCallButton';
import { EndSessionButton } from 'components/Buttons/EndSessionButton';
import { ScreenSwitchButton } from 'components/Buttons/ScreenSwitchButton';
import ToggleChatButton from 'components/Buttons/ToggleChatButton/ToggleChatButton';
import { ToggleAdminWindowButton } from 'components/Buttons/ToggleAdminWindowButton';
import { ToggleSettingsButton } from 'components/Buttons/ToggleSettingsButton';
import { UserGroup } from 'types/UserGroup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      height: `${theme.footerHeight}px`,
      display: 'flex',
      padding: '0 1.43em',
      zIndex: 10,
      [theme.breakpoints.down('sm')]: {
        height: `${theme.mobileFooterHeight}px`,
        padding: 0,
      },
    },
    screenShareBanner: {
      position: 'fixed',
      zIndex: 8,
      bottom: `${theme.footerHeight}px`,
      left: 0,
      right: 0,
      height: '104px',
      background: 'rgba(0, 0, 0, 0.5)',
      '& h6': {
        color: 'white',
      },
      '& button': {
        background: 'white',
        color: theme.brand,
        border: `2px solid ${theme.brand}`,
        margin: '0 2em',
        '&:hover': {
          color: '#600101',
          border: `2px solid #600101`,
          background: '#FFE9E7',
        },
      },
    },
    hideMobile: {
      display: 'initial',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';
  const { userGroup } = useSessionContext();

  if (userGroup === UserGroup.StreamServer || userGroup === UserGroup.StreamServerTranslated) {
    return null;
  }

  return (
    <>
      {isSharingScreen && (
        <Grid container justifyContent="center" alignItems="center" className={classes.screenShareBanner}>
          <Typography variant="h6">You are sharing your screen</Typography>
          <Button onClick={() => toggleScreenShare()}>Stop Sharing</Button>
        </Grid>
      )}
      <footer className={'fixed bottom-0 z-30 flex flex-col py-5 w-full justify-center items-center space-y-5'}>
        <div className="flex space-x-5 items-center w-full justify-center relative">
          <ToggleAudioButton disabled={isReconnecting} />
          <ToggleVideoButton disabled={isReconnecting} />
          <EndCallButton />
          <ToggleChatButton />

          {/* {!isSharingScreen && !isMobile && <ToggleScreenShareButton disabled={isReconnecting} />}
              {process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && <ToggleChatButton />} */}
          {userGroup === UserGroup.Moderator ? (
            <>
              <ScreenSwitchButton />
            </>
          ) : null}

          <ToggleSettingsButton />

          {userGroup === UserGroup.Moderator ? (
            <>
              <ToggleAdminWindowButton />
              <EndSessionButton />
              <Menu />
            </>
          ) : null}
        </div>
      </footer>
    </>
  );
}
