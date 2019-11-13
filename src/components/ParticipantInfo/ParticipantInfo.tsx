import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant, RemoteVideoTrack, LocalVideoTrack } from 'twilio-video';

import BandwidthWarning from './BandwidthWarning/BandwidthWarning';
import MicOff from '@material-ui/icons/MicOff';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import usePublicationIsTrackEnabled from '../../hooks/usePublicationIsTrackEnabled/usePublicationIsTrackEnabled';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';

const Container = styled(({ isSwitchedOff, ...otherProps }: { isSwitchedOff?: boolean }) => <div {...otherProps} />)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  minHeight: '5em',
  overflow: 'hidden',
  '& video': {
    filter: ({ isSwitchedOff }) => (isSwitchedOff ? 'blur(4px) grayscale(1) brightness(0.5)' : 'none'),
  },
});

export const InfoContainer = styled(({ hideVideo, ...otherProps }: { hideVideo?: boolean }) => <div {...otherProps} />)(
  {
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: '0.4em',
    width: '100%',
    background: ({ hideVideo }) => (hideVideo ? 'black' : 'transparent'),
  }
);

const Identity = styled('h4')({
  background: 'rgba(0, 0, 0, 0.7)',
  padding: '0.1em 0.3em',
  margin: 0,
});

const InfoRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

interface ParticipantInfoProps {
  participant: LocalParticipant | RemoteParticipant;
  children: React.ReactNode;
}

export default function ParticipantInfo({ participant, children }: ParticipantInfoProps) {
  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.trackName === 'microphone');
  const videoPublication = publications.find(p => p.trackName === 'camera');
  const screenSharePublication = publications.find(p => p.trackName === 'screen');

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isAudioEnabled = usePublicationIsTrackEnabled(audioPublication);
  const isVideoEnabled = usePublicationIsTrackEnabled(videoPublication);
  const isScreenShareEnabled = usePublicationIsTrackEnabled(screenSharePublication);

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  return (
    <Container isSwitchedOff={isVideoSwitchedOff}>
      <InfoContainer hideVideo={!isVideoEnabled}>
        <InfoRow>
          <Identity>{participant.identity}</Identity>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </InfoRow>
        <div>
          {!isAudioEnabled && <MicOff />}
          {!isVideoEnabled && <VideocamOff />}
          {isScreenShareEnabled && <ScreenShare />}
        </div>
      </InfoContainer>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </Container>
  );
}
