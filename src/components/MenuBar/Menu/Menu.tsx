import React, { useState, useRef } from 'react';
import AboutDialog from '../../AboutDialog/AboutDialog';
import BackgroundIcon from '../../../icons/BackgroundIcon';
import CollaborationViewIcon from '@material-ui/icons/AccountBox';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GridViewIcon from '@material-ui/icons/Apps';
import InfoIconOutlined from '../../../icons/InfoIconOutlined';
import MoreIcon from '@material-ui/icons/MoreVert';
import StartRecordingIcon from '../../../icons/StartRecordingIcon';
import StopRecordingIcon from '../../../icons/StopRecordingIcon';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '../../../icons/SettingsIcon';
import { Button, styled, Theme, useMediaQuery, Menu as MenuContainer, MenuItem, Typography } from '@material-ui/core';
import { isSupported } from '@twilio/video-processors';

import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useIsRecording from '../../../hooks/useIsRecording/useIsRecording';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import FlipCameraIcon from '../../../icons/FlipCameraIcon';
import useFlipCameraToggle from '../../../hooks/useFlipCameraToggle/useFlipCameraToggle';
import { VideoRoomMonitor } from '@twilio/video-room-monitor';

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

  const { isFetching, updateRecordingRules, roomType, setIsGalleryViewActive, isGalleryViewActive } = useAppState();
  const { setIsChatWindowOpen } = useChatContext();
  const isRecording = useIsRecording();
  const { room, setIsBackgroundSelectionOpen } = useVideoContext();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } = useFlipCameraToggle();

  return (
    <>
      <Button
        onClick={() => setMenuOpen(isOpen => !isOpen)}
        ref={anchorRef}
        className={props.buttonClassName}
        data-cy-more-button
      >
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
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <IconContainer>
            <SettingsIcon />
          </IconContainer>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>

        {isSupported && (
          <MenuItem
            onClick={() => {
              setIsBackgroundSelectionOpen(true);
              setIsChatWindowOpen(false);
              setMenuOpen(false);
            }}
          >
            <IconContainer>
              <BackgroundIcon />
            </IconContainer>
            <Typography variant="body1">Backgrounds</Typography>
          </MenuItem>
        )}

        {flipCameraSupported && (
          <MenuItem disabled={flipCameraDisabled} onClick={toggleFacingMode}>
            <IconContainer>
              <FlipCameraIcon />
            </IconContainer>
            <Typography variant="body1">Flip Camera</Typography>
          </MenuItem>
        )}

        {roomType !== 'peer-to-peer' && roomType !== 'go' && (
          <MenuItem
            disabled={isFetching}
            onClick={() => {
              setMenuOpen(false);
              if (isRecording) {
                updateRecordingRules(room!.sid, [{ type: 'exclude', all: true }]);
              } else {
                updateRecordingRules(room!.sid, [{ type: 'include', all: true }]);
              }
            }}
            data-cy-recording-button
          >
            <IconContainer>{isRecording ? <StopRecordingIcon /> : <StartRecordingIcon />}</IconContainer>
            <Typography variant="body1">{isRecording ? 'Stop' : 'Start'} Recording</Typography>
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            VideoRoomMonitor.toggleMonitor();
            setMenuOpen(false);
          }}
        >
          <IconContainer>
            <SearchIcon style={{ fill: '#707578', width: '0.9em' }} />
          </IconContainer>
          <Typography variant="body1">Room Monitor</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setIsGalleryViewActive(isGallery => !isGallery);
            setMenuOpen(false);
          }}
        >
          <IconContainer>
            {isGalleryViewActive ? (
              <CollaborationViewIcon style={{ fill: '#707578', width: '0.9em' }} />
            ) : (
              <GridViewIcon style={{ fill: '#707578', width: '0.9em' }} />
            )}
          </IconContainer>
          <Typography variant="body1">{isGalleryViewActive ? 'Speaker View' : 'Gallery View'}</Typography>
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
    </>
  );
}
