import React, { createContext, ReactNode } from 'react';
import { ConnectOptions, LocalTrack, Room, TwilioError } from 'twilio-video';
import { Callback, ErrorCallback } from '../../types';
import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';

import useHandleRoomDisconnectionErrors from './useHandleRoomDisconnectionErrors/useHandleRoomDisconnectionErrors';
import useHandleOnDisconnect from './useHandleOnDisconnect/useHandleOnDisconnect';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';

/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
 */

export interface IVideoContext {
  room: Room;
  localTracks: LocalTrack[];
  isConnecting: boolean;
  onError: ErrorCallback;
  onDisconnect: Callback;
  getLocalAudioTrack: Function;
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

  const { localTracks, getLocalAudioTrack, getLocalVideoTrack } = useLocalTracks();
  const { room, isConnecting } = useRoom(localTracks, onErrorCallback, token, options);

  useRoomCallbacks(room, onErrorCallback, onDisconnect);

  return (
    <VideoContext.Provider
      value={{
        room,
        localTracks,
        isConnecting,
        onError: onErrorCallback,
        onDisconnect,
        getLocalAudioTrack,
        getLocalVideoTrack,
      }}
    >
      <SelectedParticipantProvider room={room}>{children}</SelectedParticipantProvider>
    </VideoContext.Provider>
  );
}
