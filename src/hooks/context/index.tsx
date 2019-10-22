import React, { createContext, ReactNode, useContext } from 'react';
import EventEmitter from 'events';
import { ConnectOptions, LocalTrack, Room } from 'twilio-video';

import useRoom from './useRoom';
import useLocalTracks from './useLocalTracks';

const VideoContext = createContext({
  room: new EventEmitter() as Room,
  localTracks: [] as LocalTrack[],
  isConnecting: false,
});

interface VideoProviderProps {
  token?: string;
  options?: ConnectOptions;
  children: ReactNode;
}

export function VideoProvider({
  token,
  options,
  children,
}: VideoProviderProps) {
  const localTracks = useLocalTracks();
  const { room, isConnecting } = useRoom(localTracks, token, options);

  return (
    <VideoContext.Provider value={{ room, localTracks, isConnecting }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  return context;
}
