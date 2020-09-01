import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import PinIcon from './PinIcon/PinIcon';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';
import { Typography } from '@material-ui/core';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const BORDER_SIZE = 2;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: 0,
      overflow: 'hidden',
      cursor: 'pointer',
      '& video': {
        filter: 'none',
        objectFit: 'contain !important',
      },
      '& svg': {
        stroke: 'black',
        strokeWidth: '0.8px',
      },
      borderRadius: '4px',
      border: `${BORDER_SIZE}px solid rgb(245, 248, 255)`,
      paddingTop: `calc(${(9 / 16) * 100}% - ${BORDER_SIZE}px)`,
      background: 'black',
      [theme.breakpoints.down('xs')]: {
        height: theme.sidebarMobileHeight,
        width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
        marginRight: '3px',
        fontSize: '10px',
      },
    },
    innerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    isDominantSpeaker: {
      border: `${BORDER_SIZE}px solid rgb(245, 248, 255)`,
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
      width: '100%',
      background: 'transparent',
      top: 0,
    },
    hideVideo: {
      background: 'black',
    },
    identity: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      padding: '0.1em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    infoRowTop: {},
    infoRowBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
    networkQualityContainer: {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
    },
  })
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
  isDominantSpeaker?: boolean;
}

export default function ParticipantInfo({
  participant,
  onClick,
  isSelected,
  children,
  isDominantSpeaker,
}: ParticipantInfoProps) {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const isLocalParticipant = participant === localParticipant;

  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const videoPublication = publications.find(p => p.trackName.includes('camera'));

  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack;

  const classes = useStyles();

  return (
    <div
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
        [classes.isDominantSpeaker]: isDominantSpeaker,
      })}
      onClick={onClick}
      data-cy-participant={participant.identity}
    >
      <div className={clsx(classes.infoContainer, { [classes.hideVideo]: !isVideoEnabled })}>
        <div className={classes.infoRowTop}>
          <div className={classes.networkQualityContainer}>
            <NetworkQualityLevel participant={participant} />
          </div>
        </div>
        <div className={classes.infoRowBottom}>
          <span className={classes.identity}>
            <AudioLevelIndicator audioTrack={audioTrack} background="white" />
            <Typography variant="body1" color="inherit" component="span">
              {participant.identity}
              {isLocalParticipant && ' (You)'}
            </Typography>
          </span>
        </div>
        <div>
          {!isVideoEnabled && <VideocamOff />}
          {isScreenShareEnabled && <ScreenShare />}
          {isSelected && <PinIcon />}
        </div>
      </div>
      <div className={classes.innerContainer}>
        {isVideoSwitchedOff && <BandwidthWarning />}
        {children}
      </div>
    </div>
  );
}
