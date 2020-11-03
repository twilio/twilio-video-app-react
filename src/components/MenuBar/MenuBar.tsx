import React, { useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { Offline, Online } from 'react-detect-offline';
import { TRACK_TYPE, NOTIFICATION_MESSAGE, ERROR_MESSAGE } from '../../utils/displayStrings';
import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import LocalAudioLevelIndicator from './LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import ToggleGridViewButton from './ToggleGridViewButton/ToggleGridViewButton';
import SettingsButton from './SettingsButton/SettingsButton';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { ParticipantInformation } from '../../state/index';

const JOIN_ROOM_MESSAGE = 'Join Room';
const RETRY_ROOM_MESSAGE = 'Retry';
const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
  })
);
const getPartyTypes = () => {
  return Object.values(PARTICIANT_TYPES);
};

const mobileAndTabletCheck = function() {
  let check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || (window as any).MyNamespace); //window.opera);
  return check;
};

export default function MenuBar() {
  const classes = useStyles();
  const [submitButtonValue, setSubmitButtonValue] = useState<any>(JOIN_ROOM_MESSAGE);
  const { setError, getToken, isFetching, authoriseParticipant, setNotification } = useAppState();
  const { isConnecting, connect, room, localTracks } = useVideoContext();
  const roomState = useRoomState();

  const [participantInfo, setParticipantInfo] = useState<any>(null);

  async function joinRoom(participantInformation) {
    try {
      const response = await getToken(participantInformation);

      if (response === NOTIFICATION_MESSAGE.ROOM_NOT_FOUND) {
        setSubmitButtonValue(RETRY_ROOM_MESSAGE);
        setNotification({ message: NOTIFICATION_MESSAGE.ROOM_NOT_FOUND });
      } else {
        await connect(response);
        setSubmitButtonValue(JOIN_ROOM_MESSAGE);
      }
    } catch (err) {
      if (err.response) setError({ message: err.response.data });
      else setError({ message: ERROR_MESSAGE.NETWORK_ERROR });

      setSubmitButtonValue(JOIN_ROOM_MESSAGE);
    }
  }

  function authorise(currentParticipantInformation) {
    async function authoriseAsync() {
      if (currentParticipantInformation === null) {
        const participantInformation: ParticipantInformation = await authoriseParticipant();

        if (participantInformation && participantInformation.displayName !== '') {
          setParticipantInfo(participantInformation);
        }
      }
    }
    authoriseAsync();
  }

  useEffect(() => {
    authorise(participantInfo);
  }, [participantInfo]);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    joinRoom(participantInfo);
  };

  let selectedAudioDevice = { label: '', deviceId: '', groupdId: '' };
  let selectedVideoDevice = { label: '', deviceId: '', groupdId: '' };
  const audioTrack = localTracks.find(x => x.kind === TRACK_TYPE.AUDIO);
  const videoTrack = localTracks.find(x => x.kind === TRACK_TYPE.VIDEO);

  if (audioTrack) {
    selectedAudioDevice = {
      label: audioTrack.mediaStreamTrack.label,
      deviceId: audioTrack.mediaStreamTrack.getSettings().deviceId as string,
      groupdId: audioTrack.mediaStreamTrack.getSettings().groupId as string,
    };
  }

  if (videoTrack) {
    selectedVideoDevice = {
      label: videoTrack.mediaStreamTrack.label,
      deviceId: videoTrack.mediaStreamTrack.getSettings().deviceId as string,
      groupdId: videoTrack.mediaStreamTrack.getSettings().groupId as string,
    };
  }

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        <img src="/escribers-logo-transparent.png" height="64px" alt="eScribers" />
        {roomState === 'disconnected' ? (
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl className={classes.textField}>
              <InputLabel>Party Type</InputLabel>
              <Select
                data-cy="select"
                label="Party Type"
                value={participantInfo ? participantInfo.partyType : ''}
                margin="dense"
                placeholder="Party Type"
                disabled={true}
              >
                {getPartyTypes().map(type => (
                  <MenuItem key={type} value={type} data-cy="menu-item">
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              autoComplete="off"
              id="party-name"
              label="Party Name"
              className={classes.textField}
              value={participantInfo ? participantInfo.displayName : ''}
              margin="dense"
              disabled={true}
            />

            <TextField
              autoComplete="off"
              id="case-number"
              label="Case Number"
              className={classes.textField}
              value={participantInfo ? participantInfo.caseReference : ''}
              margin="dense"
              disabled={true}
            />
            <Online>
              <Button
                className={classes.joinButton}
                type="submit"
                color="primary"
                variant="contained"
                disabled={isConnecting || !participantInfo || isFetching}
              >
                {submitButtonValue}
              </Button>
            </Online>
            <Offline>
              <Button className={classes.joinButton} color="primary" variant="contained" disabled={true}>
                Offline
              </Button>
            </Offline>
            {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
          </form>
        ) : (
          <h3 style={{ paddingLeft: '10px' }}>
            Case Reference: {participantInfo ? participantInfo.caseReference : ''}
          </h3>
        )}
        <div className={classes.rightButtonContainer}>
          <ToggleGridViewButton />
          {!mobileAndTabletCheck() && (
            <SettingsButton selectedAudioDevice={selectedAudioDevice} selectedVideoDevice={selectedVideoDevice} />
          )}
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton />
        </div>
      </Toolbar>
    </AppBar>
  );
}
