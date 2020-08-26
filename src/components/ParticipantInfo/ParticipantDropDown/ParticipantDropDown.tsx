import React from 'react';
import { useAppState } from '../../../state';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
const REMOVE = 'Remove';
const options = [REMOVE];
const ITEM_HEIGHT = 48;

export default function ParticipantDropDown({ participant }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, option) => {
    event.stopPropagation();
    setAnchorEl(null);
    if (option === REMOVE) {
      console.log(participant.sid);
      console.log(options.length);
      removeParticipant(participant.sid).catch(err => {
        setError({ message: err.response.data });
      });
    }
  };

  const { setError, removeParticipant } = useAppState();

  return (
    <div style={{ float: 'right' }}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        style={{
          padding: '0 5px',
        }}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map(option => (
          <MenuItem key={option} onClick={event => handleClose(event, option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
