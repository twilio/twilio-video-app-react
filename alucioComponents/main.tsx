// Alucio Custom Components
export { default as Presenter } from './components/Presenter';

// App
export { default as UnsupportedBrowserWarning } from './components/UnsupportedBrowserWarning';
export { VideoProvider } from '../src/components/VideoProvider';

// Hooks
export { default as useHeight } from '../src/hooks/useHeight/useHeight';
export { default as useRoomState } from '../src/hooks/useRoomState/useRoomState';
export { default as useVideoContext } from '../src/hooks/useVideoContext/useVideoContext';
export { default as useMainSpeaker } from '../src/hooks/useMainSpeaker/useMainSpeaker';
export { default as useParticipantNetworkQualityLevel } from '../src/hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
export { default as useLocalAudioToggle } from '../src/hooks/useLocalAudioToggle/useLocalAudioToggle';
export { default as useLocalVideoToggle } from '../src/hooks/useLocalVideoToggle/useLocalVideoToggle';

// Video
export { default as LocalVideoPreview } from './components/LocalVideoPreview/LocalVideoPreview';
export { default as NetworkQualityLevel } from './components/NewtorkQualityLevel/NetworkQualityLevel';
export { default as LocalAudioLevelIndicator } from './components/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
export { default as MainParticipant } from './components/MainParticipant/MainParticipant';
 
// Util
import generateConnectionOptions from '../src/utils/generateConnectionOptions/generateConnectionOptions';
import AppStateProvider, { useAppState } from '../src/state';

export { AppStateProvider, useAppState, generateConnectionOptions };