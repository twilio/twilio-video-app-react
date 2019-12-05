import React, { createContext, ReactNode, useContext } from 'react';
import { ConnectOptions, LocalTrack, Room, TwilioError } from 'twilio-video';
import { Callback, ErrorCallback } from '../../types';
import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';

import useHandleRoomDisconnectionErrors from './useHandleRoomDisconnectionErrors/useHandleRoomDisconnectionErrors';
import useHandleOnDisconnect from './useHandleOnDisconnect/useHandleOnDisconnect';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';

export interface IVideoContext {
  room: Room;
  localTracks: LocalTrack[];
  isConnecting: boolean;
  onError: ErrorCallback;
  onDisconnect: Callback;
  getLocalVideoTrack: Function;
}

export const VideoContext = createContext<IVideoContext>(null!);

interface VideoProviderProps {
  token?: string;
  options?: ConnectOptions;
  onError: ErrorCallback;
  onDisconnect: Callback;
  children: ReactNode;
}

const useRoomCallbacks = (room: Room, onError: Callback, onDisconnect: Callback) => {
  useHandleRoomDisconnectionErrors(room, onError);
  useHandleTrackPublicationFailed(room, onError);
  useHandleOnDisconnect(room, onDisconnect);
};

export function VideoProvider({
  token,
  options,
  children,
  onError = () => {},
  onDisconnect = () => {},
}: VideoProviderProps) {
  const onErrorCallback = (error: TwilioError) => {
    console.log(`ERROR: ${error.message}`, error);
    onError(error);
  };

  const [localTracks, getLocalVideoTrack] = useLocalTracks();
  const { room, isConnecting } = useRoom(localTracks, onErrorCallback, token, options);

  useRoomCallbacks(room, onErrorCallback, onDisconnect);

  return (
    <VideoContext.Provider
      value={{ room, localTracks, isConnecting, onError: onErrorCallback, onDisconnect, getLocalVideoTrack }}
    >
      <SelectedParticipantProvider room={room}>{children}</SelectedParticipantProvider>
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
}
