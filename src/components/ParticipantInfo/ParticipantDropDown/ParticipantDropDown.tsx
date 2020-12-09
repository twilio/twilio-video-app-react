import React from 'react';
import { useAppState } from '../../../state';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { TRACK_TYPE } from '../../../utils/displayStrings';
import { Participant } from 'twilio-video';
import { IMuteRemoteParticipantMessage } from '../../../utils/muteRemoteParticipantMessage';

interface ParticipantDropDownProps {
  participant: Participant;
}

const REMOVE = 'Remove';
const MUTE = 'Mute';
const options = [MUTE, REMOVE];
const ITEM_HEIGHT = 48;

export default function ParticipantDropDown({ participant }: ParticipantDropDownProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const videoContext = useVideoContext();

  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, option) => {
    event.stopPropagation();
    setAnchorEl(null);
    console.log('user chose option: ' + option);

    if (option === MUTE) {
      console.log(participant.sid);
      //console.log(options.length);
      console.log('attempting to mute now');
      muteParticipant(participant);
    }

    if (option === REMOVE) {
      console.log(participant.sid);
      //console.log(options.length);
      removeParticipant(participant.sid).catch(err => {
        setError({ message: err.response.data });
      });
    }
  };

  function muteParticipant(participantToMute: Participant) {
    let localModeratorDataTrack = Array.from(videoContext.room.localParticipant.dataTracks.values()).filter(
      dataTrack => dataTrack.kind === TRACK_TYPE.DATA
    );
    if (localModeratorDataTrack && localModeratorDataTrack.length >= 1) {
      var muteRemoteParticipantMessage = {} as IMuteRemoteParticipantMessage;
      muteRemoteParticipantMessage.action = 'mute';
      muteRemoteParticipantMessage.participantSid = participantToMute.sid;

      localModeratorDataTrack[0].track.send(JSON.stringify(muteRemoteParticipantMessage));
    }
  }

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
