import React, { useState, useRef, useCallback } from 'react';
import AboutDialog from '../AboutDialog/AboutDialog';
import IconButton from '@material-ui/core/IconButton';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import UserAvatar from '../UserAvatar/UserAvatar';

import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function Menu() {
  const { user, appointmentID } = useAppState();
  const { room, localTracks } = useVideoContext();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  const finishAppointment = () => {
    if (window.confirm('¿Estas seguro de terminar esta sesión?')) {
      $.ajax(`/appointments/${appointmentID}`, {
        type: 'PATCH',
        data: { appointment: { completed: true } }
      })
    }
  };

  return (
    <div ref={anchorRef}>
      <IconButton color="inherit" onClick={() => setMenuOpen(state => !state)}>
        {user ? <UserAvatar user={user} /> : <MoreIcon />}
      </IconButton>
      <MenuContainer open={menuOpen} onClose={() => setMenuOpen(state => !state)} anchorEl={anchorRef.current}>
        {user?.displayName && <MenuItem disabled>{user.displayName}</MenuItem>}
        { user.userType === 'Doctor' ? ( <MenuItem onClick={finishAppointment}>Terminar cita</MenuItem> ) : null }
        <MenuItem onClick={() => setAboutOpen(true)}>Nosotros</MenuItem>
        <MenuItem onClick={() => setSettingsOpen(true)}>Configuración</MenuItem>
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
    </div>
  );
}
