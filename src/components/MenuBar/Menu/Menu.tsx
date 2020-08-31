import React, { useState, useRef, useCallback } from 'react';
import AboutDialog from '../AboutDialog/AboutDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsDialog from '../SettingsDialog/SettingsDialog';

import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { Button } from '@material-ui/core';

export default function Menu() {
  const { user, signOut } = useAppState();
  const { room, localTracks } = useVideoContext();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleSignOut = useCallback(() => {
    room.disconnect?.();
    localTracks.forEach(track => track.stop());
    signOut?.();
  }, [room.disconnect, localTracks, signOut]);

  return (
    <>
      <Button onClick={() => setMenuOpen(state => !state)} ref={anchorRef}>
        Settings
        <ExpandMoreIcon />
      </Button>
      <MenuContainer open={menuOpen} onClose={() => setMenuOpen(state => !state)} anchorEl={anchorRef.current}>
        {user?.displayName && <MenuItem disabled>{user.displayName}</MenuItem>}
        <MenuItem onClick={() => setAboutOpen(true)}>About</MenuItem>
        <MenuItem onClick={() => setSettingsOpen(true)}>Settings</MenuItem>
        {user && <MenuItem onClick={handleSignOut}>Logout</MenuItem>}
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <SettingsDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
