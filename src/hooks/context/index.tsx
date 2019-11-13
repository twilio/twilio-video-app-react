import EventEmitter from 'events';
import React, { createContext, ReactNode, useContext } from 'react';
import { ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';
import useLocalTracks from './useLocalTracks';
import useRoom from './useRoom';

export interface IVideoContext {
  room: Room;
  localTracks: LocalTrack[];
  isConnecting: boolean;
}

export const VideoContext = createContext<IVideoContext>({
  room: new EventEmitter() as Room,
  localTracks: [],
  isConnecting: false,
});

interface VideoProviderProps {
  token?: string;
  options?: ConnectOptions;
  children: ReactNode;
}

export function VideoProvider({ token, options, children }: VideoProviderProps) {
  const localTracks = useLocalTracks();
  const { room, isConnecting } = useRoom(localTracks, token, options);

  return (
    <VideoContext.Provider value={{ room, localTracks, isConnecting }}>
      <SelectedParticipantProvider>{children}</SelectedParticipantProvider>
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  return context;
}
