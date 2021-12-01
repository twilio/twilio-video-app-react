import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import PinIcon from './PinIcon/PinIcon';
import ScreenShareIcon from '../../icons/ScreenShareIcon';

import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import useParticipantIsReconnecting from '../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import { nameFromIdentity } from 'utils/participants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: 0,
      '& video': {
        filter: 'none',
        objectFit: 'contain !important',
      },
      paddingTop: `calc(${(9 / 16) * 100}% - ${theme.participantBorderWidth}px)`,
    },
    innerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    infoContainer: {
      position: 'absolute',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      background: 'transparent',
      top: 0,
    },
    screenShareIconContainer: {
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '0.18em 0.3em',
      marginRight: '0.3em',
      display: 'flex',
      '& path': {
        fill: 'white',
      },
    },
    identity: {
      color: 'white',
      padding: '0.18em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    infoRowBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
    typeography: {
      color: 'white',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
      },
    },
    hideParticipant: {
      display: 'none',
    },
    cursorPointer: {
      cursor: 'pointer',
    },
  })
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isModerator?: boolean;
  noName: boolean;
  isActivePlayer?: boolean;
  roundsPlayed?: number;
}

export default function ParticipantInfo({
  participant,
  onClick,
  isSelected,
  children,
  isLocalParticipant,
  hideParticipant,
  isModerator,
  noName,
  roundsPlayed,
}: ParticipantInfoProps) {
  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const videoPublication = publications.find(p => !p.trackName.includes('screen') && p.kind === 'video');

  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const classes = useStyles();

  const name = nameFromIdentity(participant.identity);

  return (
    <div
      className={clsx('rounded-xl', classes.container, {
        [classes.hideParticipant]: hideParticipant,
        [classes.cursorPointer]: Boolean(onClick),
      })}
      onClick={onClick}
      data-cy-participant={name}
    >
      <div className={classes.infoContainer}>
        {!roundsPlayed || roundsPlayed <= 0 ? null : (
          <span className="absolute -top-3 -right-3 bg-purple rounded-full filter drop-shadow-lg text-white w-7 h-7 flex items-center justify-center z-30">
            {roundsPlayed}
          </span>
        )}
        {/* <NetworkQualityLevel participant={participant} /> */}
        <div className={classes.infoRowBottom}>
          {isScreenShareEnabled && (
            <span className={classes.screenShareIconContainer}>
              <ScreenShareIcon />
            </span>
          )}
          <span className={'flex pl-2 pb-2 text-base filter drop-shadow-xl items-center font-medium text-white'}>
            {isModerator ? (
              <span className="bg-orange p-2 w-8 h-8 flex items-center justify-center rounded-full">
                {name.charAt(0).toUpperCase()}
              </span>
            ) : null}
            <AudioLevelIndicator audioTrack={audioTrack} />
            <span>
              {noName ? '' : name}
              {isLocalParticipant && ' (Du)'}
            </span>
          </span>
        </div>
        <div>{isSelected && <PinIcon />}</div>
      </div>
      <div className={classes.innerContainer}>
        {/* <Transition
          show={!isVideoEnabled || isVideoSwitchedOff}
          className="transition-all duration-1000 absolute w-full h-full"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="w-full h-full bg-black flex items-center justify-center rounded-xl">
            <div className="w-12 h-12">
              <AvatarIcon />
            </div>
          </div>
        </Transition> */}
        {isParticipantReconnecting && (
          <div className="rounded-xl text-white absolute top-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
            Reconnecting...
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
