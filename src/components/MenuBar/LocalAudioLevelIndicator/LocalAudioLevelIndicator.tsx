import React from 'react';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import AudioLevelIndicator from '../../AudioLevelIndicator/AudioLevelIndicator';
import { LocalAudioTrack } from 'twilio-video';
import { TRACK_TYPE } from '../../../utils/displayStrings';
export default function LocalAudioLevelIndicator() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === TRACK_TYPE.AUDIO) as LocalAudioTrack;
  return <AudioLevelIndicator size={30} audioTrack={audioTrack} />;
}
