import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';

import AboutDialog from '../../../MenuBar/AboutDialog/AboutDialog';
import ConnectionOptions from '../../../MenuBar/ConnectionOptions/ConnectionOptions';
import DeviceSelector from '../../../MenuBar/DeviceSelector/DeviceSelector';
import SettingsIcon from '../../SettingsIcon';

const useStyles = makeStyles({
  settingsButton: {
    margin: '1.8em 0 0',
  },
});

export default function SettingsMenu() {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [deviceSettingsOpen, setDeviceSettingsOpen] = useState(false);
  const [connectionSettingsOpen, setConnectionSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={anchorRef}
        onClick={() => setMenuOpen(true)}
        startIcon={<SettingsIcon />}
        className={classes.settingsButton}
      >
        Settings
      </Button>
      <MenuContainer open={menuOpen} onClose={() => setMenuOpen(isOpen => !isOpen)} anchorEl={anchorRef.current}>
        <MenuItem onClick={() => setAboutOpen(true)}>
          <Typography variant="body1">About</Typography>
        </MenuItem>
        <MenuItem onClick={() => setDeviceSettingsOpen(true)}>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>
        <MenuItem onClick={() => setConnectionSettingsOpen(true)}>
          <Typography variant="body1">Connection Settings</Typography>
        </MenuItem>
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <DeviceSelector
        open={deviceSettingsOpen}
        onClose={() => {
          setDeviceSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
      <ConnectionOptions
        open={connectionSettingsOpen}
        onClose={() => {
          setConnectionSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
