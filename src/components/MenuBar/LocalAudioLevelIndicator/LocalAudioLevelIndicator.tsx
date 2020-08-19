import React from 'react';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import AudioLevelIndicator from '../../AudioLevelIndicator/AudioLevelIndicator';
import { LocalAudioTrack } from 'twilio-video';

export default function LocalAudioLevelIndicator() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  return <AudioLevelIndicator size={30} audioTrack={audioTrack} />;
}
