import React, { useState, useRef } from 'react';
import AboutDialog from '../../AboutDialog/AboutDialog';
import Button from '@material-ui/core/Button';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIconOutlined from '../../../icons/InfoIconOutlined';
import { Link, styled, Theme, useMediaQuery } from '@material-ui/core';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import RecordingButton from './RecordingButton/RecordingButton';
import SettingsIcon from '../../../icons/SettingsIcon';
import Snackbar from '../../Snackbar/Snackbar';
import Typography from '@material-ui/core/Typography';

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
  const [isRecordingSnackbarOpen, setIsRecordingSnackbarOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

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
        <RecordingButton onClick={() => setMenuOpen(false)} setIsRecordingSnackbarOpen={setIsRecordingSnackbarOpen} />

        <MenuItem onClick={() => setSettingsOpen(true)}>
          <IconContainer>
            <SettingsIcon />
          </IconContainer>
          <Typography variant="body1">Conference Settings</Typography>
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
    </>
  );
}
