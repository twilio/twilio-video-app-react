import React, { createContext, ReactNode, useCallback, useState } from 'react';
import { CreateLocalTrackOptions, ConnectOptions, LocalAudioTrack, LocalVideoTrack, Room } from 'twilio-video';
import { ErrorCallback } from '../../types';
import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';

import AttachVisibilityHandler from './AttachVisibilityHandler/AttachVisibilityHandler';
import useBackgroundSettings, { BackgroundSettings } from './useBackgroundSettings/useBackgroundSettings';
import useMaskSettings, { MaskSettings } from './useMaskSettings/useMaskSettings';
import useHandleRoomDisconnection from './useHandleRoomDisconnection/useHandleRoomDisconnection';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRestartAudioTrackOnDeviceChange from './useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange';
import useRoom from './useRoom/useRoom';
import useScreenShareToggle from './useScreenShareToggle/useScreenShareToggle';

/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
 */

export interface IVideoContext {
  room: Room | null;
  localTracks: (LocalAudioTrack | LocalVideoTrack)[];
  isConnecting: boolean;
  connect: (token: string) => Promise<void>;
  onError: ErrorCallback;
  getLocalVideoTrack: (newOptions?: CreateLocalTrackOptions) => Promise<LocalVideoTrack>;
  getLocalAudioTrack: (deviceId?: string) => Promise<LocalAudioTrack>;
  isAcquiringLocalTracks: boolean;
  removeLocalVideoTrack: () => void;
  isSharingScreen: boolean;
  toggleScreenShare: () => void;
  getAudioAndVideoTracks: () => Promise<void>;
  isBackgroundSelectionOpen: boolean;
  isMaskSelectionOpen: boolean;
  setIsBackgroundSelectionOpen: (value: boolean) => void;
  setIsMaskSelectionOpen: (value: boolean) => void;
  backgroundSettings: BackgroundSettings;
  maskSettings: MaskSettings;
  setBackgroundSettings: (settings: BackgroundSettings) => void;
  setMaskSettings: (settings: MaskSettings) => void;
}

export const VideoContext = createContext<IVideoContext>(null!);

interface VideoProviderProps {
  options?: ConnectOptions;
  onError: ErrorCallback;
  children: ReactNode;
}

export function VideoProvider({ options, children, onError = () => {} }: VideoProviderProps) {
  const onErrorCallback: ErrorCallback = useCallback(
    error => {
      console.log(`ERROR: ${error.message}`, error);
      onError(error);
    },
    [onError]
  );

  const {
    localTracks,
    getLocalVideoTrack,
    getLocalAudioTrack,
    isAcquiringLocalTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    getAudioAndVideoTracks,
  } = useLocalTracks();
  const { room, isConnecting, connect } = useRoom(localTracks, onErrorCallback, options);

  const [isSharingScreen, toggleScreenShare] = useScreenShareToggle(room, onError);

  // Register callback functions to be called on room disconnect.
  useHandleRoomDisconnection(
    room,
    onError,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    isSharingScreen,
    toggleScreenShare
  );
  useHandleTrackPublicationFailed(room, onError);
  useRestartAudioTrackOnDeviceChange(localTracks);

  const [isBackgroundSelectionOpen, setIsBackgroundSelectionOpen] = useState(false);
  const [isMaskSelectionOpen, setIsMaskSelectionOpen] = useState(false);
  const videoTrack = localTracks.find(track => !track.name.includes('screen') && track.kind === 'video') as
    | LocalVideoTrack
    | undefined;
  const [backgroundSettings, setBackgroundSettings] = useBackgroundSettings(videoTrack, room);
  const [maskSettings, setMaskSettings] = useMaskSettings(videoTrack, room);

  return (
    <VideoContext.Provider
      value={{
        room,
        localTracks,
        isConnecting,
        onError: onErrorCallback,
        getLocalVideoTrack,
        getLocalAudioTrack,
        connect,
        isAcquiringLocalTracks,
        removeLocalVideoTrack,
        isSharingScreen,
        toggleScreenShare,
        getAudioAndVideoTracks,
        isBackgroundSelectionOpen,
        isMaskSelectionOpen,
        setIsBackgroundSelectionOpen,
        setIsMaskSelectionOpen,
        backgroundSettings,
        maskSettings,
        setBackgroundSettings,
        setMaskSettings,
      }}
    >
      <SelectedParticipantProvider room={room}>{children}</SelectedParticipantProvider>
      {/* 
        The AttachVisibilityHandler component is using the useLocalVideoToggle hook
        which must be used within the VideoContext Provider.
      */}
      <AttachVisibilityHandler />
    </VideoContext.Provider>
  );
}
