import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useResizeObserver from 'use-resize-observer';
import {
  LocalAudioTrack,
  LocalVideoTrack,
  Participant,
  RemoteAudioTrack,
  RemoteVideoTrack,
  RemoteVideoTrackStats,
  LocalVideoTrackStats,
  RemoteTrackPublication,
  LocalVideoTrackPublication,
} from 'twilio-video';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import PinIcon from './PinIcon/PinIcon';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';
import useStatsReport from '../../hooks/useStatsReport/useStatsReport';

const useStyles = makeStyles((theme: Theme) =>
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
    stats: {
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '0.1em 0.1em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      fontSize: '11px',
      fontFamily: 'monospace',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

export default function ParticipantInfo({ participant, onClick, isSelected, children }: ParticipantInfoProps) {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();

  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const videoPublication = publications.find(p => p.trackName.includes('camera'));

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication) as LocalVideoTrack | RemoteVideoTrack;
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack;

  const classes = useStyles();

  const statsReports = useStatsReport();

  var videoTrackPriority = undefined;
  var videoTrackSid = '';
  var trackDimensions = '';
  var screenShareTrackPriority = undefined;
  var screenShareDimensions = '';
  if (isVideoEnabled && statsReports[0]) {
    videoTrackSid = videoPublication ? videoPublication.trackSid : '';
    const isLocal = statsReports[0].localVideoTrackStats.some(t => t.trackSid === videoTrackSid);
    const isRemote = statsReports[0].remoteVideoTrackStats.some(t => t.trackSid === videoTrackSid);
    if (isLocal) {
      const localVideoTrackStatsReports = statsReports[0].localVideoTrackStats.filter(
        t => t.trackSid === videoTrackSid
      );
      localVideoTrackStatsReports.map(function(item) {
        const frameRate = (item as LocalVideoTrackStats).frameRate
          ? 'x' + (item as LocalVideoTrackStats).frameRate
          : '';
        const dimensions = (item as LocalVideoTrackStats).dimensions;
        const width = dimensions ? dimensions.width : 0;
        const height = dimensions ? dimensions.height : 0;
        trackDimensions += String(width) + 'x' + String(height) + String(frameRate) + ' ';
      });
      trackDimensions = 'C' + videoTrackSid.substring(0, 5).toUpperCase() + ' ' + trackDimensions;
      videoTrackPriority = (videoPublication as LocalVideoTrackPublication)
        ? (videoPublication as LocalVideoTrackPublication).priority
        : undefined;
    }
    if (isRemote) {
      var videoTrackStats = statsReports[0].remoteVideoTrackStats.find(t => t.trackSid === videoTrackSid);
      const frameRate = (videoTrackStats as RemoteVideoTrackStats).frameRate;
      const dimensions = (videoTrackStats as RemoteVideoTrackStats).dimensions;
      const width = dimensions ? dimensions.width : 0;
      const height = dimensions ? dimensions.height : 0;
      trackDimensions = String(width) + 'x' + String(height) + 'x' + String(frameRate);
      videoTrackPriority = (videoTrack as RemoteVideoTrack) ? (videoTrack as RemoteVideoTrack).priority : undefined;
    }
    videoTrackPriority = 'CPR ' + videoTrackPriority;
  }
  if (isScreenShareEnabled && statsReports[0]) {
    const isLocal = statsReports[0].localVideoTrackStats.some(t => t.trackSid === isScreenShareEnabled.trackSid);
    const isRemote = statsReports[0].remoteVideoTrackStats.some(t => t.trackSid === isScreenShareEnabled.trackSid);
    if (isLocal) {
      const localVideoTrackStatsReports = statsReports[0].localVideoTrackStats.filter(
        t => t.trackSid === isScreenShareEnabled.trackSid
      );
      localVideoTrackStatsReports.map(function(item) {
        const frameRate = (item as LocalVideoTrackStats).frameRate
          ? 'x' + (item as LocalVideoTrackStats).frameRate
          : '';
        const dimensions = (item as LocalVideoTrackStats).dimensions;
        const width = dimensions ? dimensions.width : 0;
        const height = dimensions ? dimensions.height : 0;
        screenShareDimensions += String(width) + 'x' + String(height) + String(frameRate) + ' ';
      });
      screenShareTrackPriority = (isScreenShareEnabled as LocalVideoTrackPublication)
        ? (isScreenShareEnabled as LocalVideoTrackPublication).priority
        : undefined;
    }
    if (isRemote) {
      var videoTrackStats = statsReports[0].remoteVideoTrackStats.find(
        t => t.trackSid === isScreenShareEnabled.trackSid
      );
      const frameRate = (videoTrackStats as RemoteVideoTrackStats).frameRate;
      const dimensions = (videoTrackStats as RemoteVideoTrackStats).dimensions;
      const width = dimensions ? dimensions.width : 0;
      const height = dimensions ? dimensions.height : 0;
      screenShareDimensions = String(width) + 'x' + String(height) + 'x' + String(frameRate);
      screenShareTrackPriority = (isScreenShareEnabled.track as RemoteVideoTrack)
        ? (isScreenShareEnabled.track as RemoteVideoTrack).priority
        : undefined;
    }
    screenShareTrackPriority = 'SPR ' + screenShareTrackPriority;
    screenShareDimensions =
      'S' + isScreenShareEnabled.trackSid.substring(0, 5).toUpperCase() + ' ' + screenShareDimensions;
  }

  return (
    <div
      ref={ref}
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
      })}
      onClick={onClick}
      data-cy-participant={participant.identity}
    >
      <div className={clsx(classes.infoContainer, { [classes.hideVideo]: !isVideoEnabled })}>
        <div className={classes.infoRow}>
          <h4 className={classes.identity}>
            <ParticipantConnectionIndicator participant={participant} />
            {participant.identity}
          </h4>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </div>
        <div className={classes.infoRow}>
          <h4 className={classes.stats}>
            ELT {width}x{height}
            <br />
            {videoTrackPriority}
            <br />
            {trackDimensions}
            <br />
            {screenShareTrackPriority}
            <br />
            {screenShareDimensions}
          </h4>
        </div>
        <div>
          <AudioLevelIndicator audioTrack={audioTrack} background="white" />
          {!isVideoEnabled && <VideocamOff />}
          {isScreenShareEnabled && <ScreenShare />}
          {isSelected && <PinIcon />}
        </div>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
