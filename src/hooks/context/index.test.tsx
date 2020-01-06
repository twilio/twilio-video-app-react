import { EventEmitter } from 'events';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Room, TwilioError } from 'twilio-video';
import { VideoProvider, useVideoContext } from './index';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';
import useHandleRoomDisconnectionErrors from './useHandleRoomDisconnectionErrors/useHandleRoomDisconnectionErrors';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useHandleOnDisconnect from './useHandleOnDisconnect/useHandleOnDisconnect';

const mockRoom = new EventEmitter() as Room;
const mockOnDisconnect = jest.fn();
jest.mock('./useRoom/useRoom', () => jest.fn(() => ({ room: mockRoom, isConnecting: false })));
jest.mock('./useLocalTracks/useLocalTracks', () =>
  jest.fn(() => ({ localTracks: ['mockTrack'], getLocalVideoTrack: jest.fn(), getLocalAudioTrack: jest.fn() }))
);
jest.mock('./useHandleRoomDisconnectionErrors/useHandleRoomDisconnectionErrors');
jest.mock('./useHandleTrackPublicationFailed/useHandleTrackPublicationFailed');
jest.mock('./useHandleTrackPublicationFailed/useHandleTrackPublicationFailed');
jest.mock('./useHandleOnDisconnect/useHandleOnDisconnect');

describe('the useVideoContext hook', () => {
  it('should correctly return the Video Context object', () => {
    const wrapper: React.FC = ({ children }) => (
      <VideoProvider
        onError={() => {}}
        onDisconnect={mockOnDisconnect}
        token="mockToken"
        options={{ dominantSpeaker: true }}
      >
        {children}
      </VideoProvider>
    );
    const { result } = renderHook(useVideoContext, { wrapper });
    expect(result.current).toEqual({
      isConnecting: false,
      localTracks: ['mockTrack'],
      room: mockRoom,
      onError: expect.any(Function),
      onDisconnect: mockOnDisconnect,
      getLocalAudioTrack: expect.any(Function),
      getLocalVideoTrack: expect.any(Function),
    });
    expect(useRoom).toHaveBeenCalledWith(['mockTrack'], expect.any(Function), 'mockToken', {
      dominantSpeaker: true,
    });
    expect(useLocalTracks).toHaveBeenCalled();
    expect(useHandleRoomDisconnectionErrors).toHaveBeenCalledWith(mockRoom, expect.any(Function));
    expect(useHandleTrackPublicationFailed).toHaveBeenCalledWith(mockRoom, expect.any(Function));
    expect(useHandleOnDisconnect).toHaveBeenCalledWith(mockRoom, mockOnDisconnect);
  });

  it('should throw an error if used outside of the VideoProvider', () => {
    const { result } = renderHook(useVideoContext);
    expect(result.error.message).toBe('useVideoContext must be used within a VideoProvider');
  });

  it('should call wrapper onError Prop when there is some error inside the context', () => {
    const mockOnError = jest.fn();
    const wrapper: React.FC = ({ children }) => (
      <VideoProvider
        onError={mockOnError}
        onDisconnect={mockOnDisconnect}
        token="mockToken"
        options={{ dominantSpeaker: true }}
      >
        {children}
      </VideoProvider>
    );
    const { result } = renderHook(useVideoContext, { wrapper });
    result.current.onError({} as TwilioError);
    expect(mockOnError).toHaveBeenCalledWith({});
  });
});
