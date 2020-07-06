// Alucio Custom Components
export { default as Presenter } from './alucioComponents/Presenter/Presenter';

// App
export { default as UnsupportedBrowserWarning } from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
export { VideoProvider } from './components/VideoProvider';
export { default as App } from './App';

// Hooks
export { default as useHeight } from './hooks/useHeight/useHeight';
export { default as useRoomState } from './hooks/useRoomState/useRoomState';
export { default as useVideoContext } from './hooks/useVideoContext/useVideoContext';
export { default as useMainSpeaker } from './hooks/useMainSpeaker/useMainSpeaker';
export { default as useParticipantNetworkQualityLevel } from './hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
export { default as useLocalAudioToggle } from './hooks/useLocalAudioToggle/useLocalAudioToggle';
export { default as useLocalVideoToggle } from './hooks/useLocalVideoToggle/useLocalVideoToggle';

// Video
export { default as LocalVideoPreview } from './components/LocalVideoPreview/LocalVideoPreview';
export { default as NetworkQualityLevel } from './components/NewtorkQualityLevel/NetworkQualityLevel';
export { default as LocalAudioLevelIndicator } from './components/MenuBar/DeviceSelector/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
export { default as MainParticipant } from './components/MainParticipant/MainParticipant';

// Util
import generateConnectionOptions from './utils/generateConnectionOptions/generateConnectionOptions';
import AppStateProvider, { useAppState } from './state';

export { AppStateProvider, useAppState, generateConnectionOptions };
