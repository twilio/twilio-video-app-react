import React, { useState, useRef } from 'react';
import AboutDialog from '../../AboutDialog/AboutDialog';
import ConfirmRecordingDialog from './ConfirmRecordingDialog/ConfirmRecordingDialog';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIconOutlined from '../../../icons/InfoIconOutlined';
import MoreIcon from '@material-ui/icons/MoreVert';
import StartRecordingIcon from '../../../icons/StartRecordingIcon';
import StopRecordingIcon from '../../../icons/StopRecordingIcon';
import SettingsIcon from '../../../icons/SettingsIcon';
import Snackbar from '../../Snackbar/Snackbar';
import {
  Button,
  Link,
  styled,
  Theme,
  useMediaQuery,
  Menu as MenuContainer,
  MenuItem,
  Typography,
} from '@material-ui/core';

import { useAppState } from '../../../state';
import useIsRecording from '../../../hooks/useIsRecording/useIsRecording';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import FlipCameraIcon from '../../../icons/FlipCameraIcon';
import useFlipCameraToggle from '../../../hooks/useFlipCameraToggle/useFlipCameraToggle';

export const IconContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: '1.5em',
  marginRight: '0.3em',
});

export default function Menu(props: { buttonClassName?: string }) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recordingConfirmDialogOpen, setRecordingConfirmDialogOpen] = useState(false);
  const [isRecordingSnackbarOpen, setIsRecordingSnackbarOpen] = useState(false);

  const { isFetching, updateRecordingRules } = useAppState();
  const { room } = useVideoContext();
  const isRecording = useIsRecording();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } = useFlipCameraToggle();

  return (
    <>
      <Button onClick={() => setMenuOpen(isOpen => !isOpen)} ref={anchorRef} className={props.buttonClassName}>
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            More
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen(isOpen => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem
          disabled={isFetching}
          onClick={() => {
            setMenuOpen(false);
            if (isRecording) {
              updateRecordingRules(room!.sid, [{ type: 'exclude', all: true }]).then(() =>
                setIsRecordingSnackbarOpen(true)
              );
            } else {
              setRecordingConfirmDialogOpen(true);
            }
          }}
        >
          <IconContainer>{isRecording ? <StopRecordingIcon /> : <StartRecordingIcon />}</IconContainer>
          <Typography variant="body1">{isRecording ? 'Stop' : 'Start'} Recording</Typography>
        </MenuItem>
        {flipCameraSupported && (
          <MenuItem disabled={flipCameraDisabled} onClick={toggleFacingMode}>
            <IconContainer>
              <FlipCameraIcon />
            </IconContainer>
            <Typography variant="body1">Flip Camera</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={() => setSettingsOpen(true)}>
          <IconContainer>
            <SettingsIcon />
          </IconContainer>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>

        <MenuItem onClick={() => setAboutOpen(true)}>
          <IconContainer>
            <InfoIconOutlined />
          </IconContainer>
          <Typography variant="body1">About</Typography>
        </MenuItem>
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
      <Snackbar
        open={isRecordingSnackbarOpen}
        headline="Recording Complete"
        message={
          <>
            You can view the recording in the{' '}
            <Link target="_blank" rel="noopener" href="https://www.twilio.com/console/video/logs/recordings">
              Twilio Console
            </Link>
            . Recordings will be available once this room has ended.
          </>
        }
        variant="info"
        handleClose={() => setIsRecordingSnackbarOpen(false)}
      ></Snackbar>

      <ConfirmRecordingDialog
        open={recordingConfirmDialogOpen}
        handleClose={() => setRecordingConfirmDialogOpen(false)}
        handleContinue={() => {
          setRecordingConfirmDialogOpen(false);
          setIsRecordingSnackbarOpen(false);
          updateRecordingRules(room!.sid, [{ type: 'include', all: true }]);
        }}
      />
    </>
  );
}
