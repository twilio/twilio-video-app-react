import React, { createContext, ReactNode, useContext } from 'react';
import { ConnectOptions, LocalTrack, Room } from 'twilio-video';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';

export interface IVideoContext {
  room: Room;
  localTracks: LocalTrack[];
  isConnecting: boolean;
}

export const VideoContext = createContext<IVideoContext>(null!);

interface VideoProviderProps {
  token?: string;
  options?: ConnectOptions;
  children: ReactNode;
}

export function VideoProvider({ token, options, children }: VideoProviderProps) {
  const localTracks = useLocalTracks();
  const { room, isConnecting } = useRoom(localTracks, token, options);

  return <VideoContext.Provider value={{ room, localTracks, isConnecting }}>{children}</VideoContext.Provider>;
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
}
