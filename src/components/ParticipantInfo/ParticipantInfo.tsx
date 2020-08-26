import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '../MenuBar/NewtorkQualityLevel/NetworkQualityLevel';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import PinIcon from './PinIcon/PinIcon';
import ParticipantDropDown from './ParticipantDropDown/ParticipantDropDown';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useHeight from '../../hooks/useHeight/useHeight';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { PARTICIANT_TYPES } from '../../utils/participantTypes';
export default function ParticipantInfo({ participant, onClick, isSelected, children, gridView }) {
  const useStyles = gridView
    ? makeStyles(theme =>
        createStyles({
          container: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            '& video': {
              filter: 'none',
            },
            '& svg': {
              stroke: 'black',
              strokeWidth: '0.8px',
            },
          },
          isVideoSwitchedOff: {
            '& video': {
              filter: 'blur(4px) grayscale(1) brightness(0.5)',
            },
          },
          infoContainer: {
            position: 'absolute',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '0.4em',
            width: '100%',
            background: 'transparent',
          },
          hideVideo: {
            background: 'black',
          },
          identity: {
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '0.1em 0.3em',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
          },
          infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
          },
        })
      )
    : makeStyles(theme =>
        createStyles({
          container: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            height: `${(theme.sidebarWidth * 9) / 16}px`,
            overflow: 'hidden',
            cursor: 'pointer',
            '& video': {
              filter: 'none',
            },
            '& svg': {
              stroke: 'black',
              strokeWidth: '0.8px',
            },
            [theme.breakpoints.down('xs')]: {
              height: theme.sidebarMobileHeight,
              width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
              marginRight: '3px',
              fontSize: '10px',
            },
          },
          isVideoSwitchedOff: {
            '& video': {
              filter: 'blur(4px) grayscale(1) brightness(0.5)',
            },
          },
          infoContainer: {
            position: 'absolute',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '0.4em',
            width: '100%',
            background: 'transparent',
          },
          hideVideo: {
            background: 'black',
          },
          identity: {
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '0.1em 0.3em',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
          },
          infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
          },
        })
      );

  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === TRACK_TYPE.AUDIO);
  const videoPublication = publications.find(p => p.kind === TRACK_TYPE.VIDEO);

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName === TRACK_TYPE.SCREEN);

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack);

  const audioTrack: any = useTrack(audioPublication);

  const classes = useStyles();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const localParticipantType = localParticipant.identity.split('@')[1];
  const participantType = participant.identity.split('@')[1];
  const enableParticipantDropDown =
    (localParticipantType === PARTICIANT_TYPES.REPORTER || localParticipantType === PARTICIANT_TYPES.HEARING_OFFICER) &&
    localParticipant.identity !== participant.identity &&
    !(localParticipantType === PARTICIANT_TYPES.HEARING_OFFICER && participantType === PARTICIANT_TYPES.REPORTER);

  const height = useHeight();
  const getHeight = () => {
    // get height in int
    let h = height.split('px')[0];
    let h1 = parseInt(h, 10);
    // adjust the height of menu bar 64px
    h1 -= 70;
    // adjust the bottom margin 70px
    h1 -= 70;
    // get height of one row
    h = (h1 / 3).toString();
    return `${h}px`;
  };
  return (
    <div
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
      })}
      style={
        gridView
          ? {
              height: getHeight(),
            }
          : {}
      }
      onClick={onClick}
      data-cy-participant={participant.identity}
    >
      <div
        className={clsx(classes.infoContainer, {
          [classes.hideVideo]: !isVideoEnabled,
        })}
      >
        <div className={classes.infoRow}>
          <h4 className={classes.identity}>
            <ParticipantConnectionIndicator participant={participant} />
            {participant.identity.split('@')[0]}({participant.identity.split('@')[1]})
          </h4>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </div>
        <div>
          <AudioLevelIndicator audioTrack={audioTrack} background="white" />
          {!isVideoEnabled && <VideocamOff />}
          {isSelected && <PinIcon />}
          {enableParticipantDropDown && <ParticipantDropDown participant={participant} />}
        </div>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
