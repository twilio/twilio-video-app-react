import React from 'react';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import PinIcon from './PinIcon/PinIcon';

import useParticipantNetworkQualityLevel from '../../../src/hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../../src/hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../../src/hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../../src/hooks/useTrack/useTrack';
import ParticipantPlaceholder from '../ParticipantInfo/ParticipantPlaceholder/ParticipantPlaceholder'
import { luxColors, Iffy } from '@alucio/lux-ui';

const useStyles = {
  controlsContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: luxColors.contentPanelBackground.primary,
  },
  isVideoSwitchedOff: {
    /* '& video': {
      filter: 'blur(4px) grayscale(1) brightness(0.5)',
    }, */
  },
  infoContainer: {
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: '0.4em',
    paddingLeft: 0,
    width: '100%',
  },
  hideVideo: {
    background: 'black',
  },
  identity: {
    color: luxColors.info.primary,
    padding: '0.1em 0.3em',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 500,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: 'flex-end'
  },
  infoRowContainer: {
    flex: 1,
    backgroundColor: luxColors.basicBlack.primary,
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '1em',
    paddingBottom: '0.55em',
    paddingTop: '0.65em',
    opacity: 0.8
  }
};

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick: () => void;
  menu?: any;
  isSelected: boolean;
}

export default function ParticipantInfo({ participant, onClick, isSelected, children, menu }: ParticipantInfoProps) {
  if(!participant){
    return null;
  }
  
  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const videoPublication = publications.find(p => p.trackName.includes('camera'));

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication) as LocalVideoTrack | RemoteVideoTrack;
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);
  
  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack;

  const classes = useStyles;
  
  function getName(name: string){
    if(name.split('.').length > 1){
      return name.split('.')[2];
    }
    return name;
  }

  return (
    <div
      // @ts-ignore
      style={classes.container}
      onClick={onClick}
      data-cy-participant={getName(participant.identity)}
    >
      <div
        // @ts-ignore
        style={classes.infoContainer}>
        {menu}
        <div style={classes.infoRow}>
          <div
            // @ts-ignore
            style={classes.infoRowContainer}>
            <h4 style={classes.identity}>
              <ParticipantConnectionIndicator participant={participant} />
              {getName(participant.identity)}
            </h4>
            <div style={classes.controlsContainer}>
              <AudioLevelIndicator audioTrack={audioTrack} />
              <NetworkQualityLevel qualityLevel={networkQualityLevel} />
            </div>
          </div>
        </div>
        <div>
          {/* {!isVideoEnabled && <VideocamOff />}
          {isScreenShareEnabled && <ScreenShare />} */}
          {isSelected && <PinIcon />}
        </div>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      <Iffy is={videoTrack?.isEnabled && videoTrack?.isStarted}>
        {children}
      </Iffy>
      <Iffy is={!(videoTrack?.isEnabled && videoTrack?.isStarted)}>
        <ParticipantPlaceholder/>
      </Iffy>
    </div>
  );
}
