import React, { useState, useRef } from 'react';
import AboutDialog from '../../AboutDialog/AboutDialog';
import Button from '@material-ui/core/Button';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FlipCameraIcon from '../../../icons/FlipCameraIcon';
import InfoIconOutlined from '../../../icons/InfoIconOutlined';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '../../../icons/SettingsIcon';
import Typography from '@material-ui/core/Typography';
import { styled, Theme, useMediaQuery } from '@material-ui/core';
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

  const anchorRef = useRef<HTMLButtonElement>(null);
  const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } = useFlipCameraToggle();

  return (
    <>
      <Button onClick={() => setMenuOpen(isOpen => !isOpen)} ref={anchorRef} className={props.buttonClassName}>
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            Settings
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
    </>
  );
}
