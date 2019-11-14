import { EventEmitter } from 'events';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Room } from 'twilio-video';
import { VideoProvider, useVideoContext } from './index';
import useLocalTracks from './useLocalTracks';
import useRoom from './useRoom';

const mockRoom = new EventEmitter() as Room;
jest.mock('./useRoom', () => jest.fn(() => ({ room: mockRoom, isConnecting: false })));
jest.mock('./useLocalTracks', () => jest.fn(() => ['mockTrack']));

describe('the useVideoContext hook', () => {
  it('should correct return the Video Context object', () => {
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
    });
    expect(useRoom).toHaveBeenCalledWith(['mockTrack'], 'mockToken', {
      dominantSpeaker: true,
    });
    expect(useLocalTracks).toHaveBeenCalled();
  });
});
