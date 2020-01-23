import React, { useState, useRef, useCallback } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/styles/makeStyles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Person from '@material-ui/icons/Person';

import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles({
  red: {
    color: 'white',
    backgroundColor: '#cc2b33',
  },
});

export function getInititals(name: string) {
  return name
    .split(' ')
    .map(text => text[0])
    .join('')
    .toUpperCase();
}

export default function UserAvatar() {
  const classes = useStyles();
  const { user, signOut } = useAppState();
  const { room, localTracks } = useVideoContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleSignOut = useCallback(() => {
    signOut().then(() => {
      room.disconnect?.();
      (localTracks as any[]).forEach(track => track.stop());
    });
  }, [room.disconnect, localTracks, signOut]);

  if (!user) {
    return null;
  }

  return (
    <div ref={anchorRef}>
      <IconButton color="inherit" onClick={() => setMenuOpen(state => !state)}>
        {user.photoURL ? (
          <Avatar src={user.photoURL} />
        ) : (
          <Avatar className={classes.red}>{user.displayName ? getInititals(user.displayName) : <Person />}</Avatar>
        )}
      </IconButton>
      <Menu open={menuOpen} onClose={() => setMenuOpen(state => !state)} anchorEl={anchorRef.current}>
        <MenuItem disabled>{user.displayName}</MenuItem>
        <MenuItem onClick={handleSignOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
