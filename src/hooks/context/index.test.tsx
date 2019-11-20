import { EventEmitter } from 'events';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Room } from 'twilio-video';
import { VideoProvider, useVideoContext } from './index';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';

const mockRoom = new EventEmitter() as Room;
jest.mock('./useRoom/useRoom', () => jest.fn(() => ({ room: mockRoom, isConnecting: false })));
jest.mock('./useLocalTracks/useLocalTracks', () => jest.fn(() => [['mockTrack'], jest.fn()]));

describe('the useVideoContext hook', () => {
  it('should correctly return the Video Context object', () => {
    const wrapper: React.FC = ({ children }) => (
      <VideoProvider token="mockToken" options={{ dominantSpeaker: true }}>
        {children}
      </VideoProvider>
    );
    const { result } = renderHook(useVideoContext, { wrapper });
    expect(result.current).toEqual({
      isConnecting: false,
      localTracks: ['mockTrack'],
      room: mockRoom,
      getLocalVideoTrack: expect.any(Function),
    });
    expect(useRoom).toHaveBeenCalledWith(['mockTrack'], 'mockToken', {
      dominantSpeaker: true,
    });
    expect(useLocalTracks).toHaveBeenCalled();
  });

  it('should throw an error if used outside of the VideoProvider', () => {
    const { result } = renderHook(useVideoContext);
    expect(result.error.message).toBe('useVideoContext must be used within a VideoProvider');
  });
});
