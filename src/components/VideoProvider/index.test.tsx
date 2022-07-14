import { EventEmitter } from 'events';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Room, TwilioError } from 'twilio-video';
import { VideoProvider } from './index';
import { useAppState } from '../../state';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRestartAudioTrackOnDeviceChange from './useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange';
import useRoom from './useRoom/useRoom';
import useHandleRoomDisconnection from './useHandleRoomDisconnection/useHandleRoomDisconnection';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const mockRoom = new EventEmitter() as Room;

jest.mock('./useRoom/useRoom', () => jest.fn(() => ({ room: mockRoom, isConnecting: false, connect: () => {} })));
jest.mock('./useLocalTracks/useLocalTracks', () =>
  jest.fn(() => ({
    localTracks: [{ name: 'mockTrack' }],
    getLocalVideoTrack: () => {},
    getLocalAudioTrack: () => {},
    isAcquiringLocalTracks: true,
    removeLocalAudioTrack: () => {},
    removeLocalVideoTrack: () => {},
  }))
);
jest.mock('../../state');
jest.mock('./useHandleRoomDisconnection/useHandleRoomDisconnection');
jest.mock('./useHandleTrackPublicationFailed/useHandleTrackPublicationFailed');
jest.mock('./useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange');
jest.mock('@twilio/video-processors', () => {
  return {
    GaussianBlurBackgroundProcessor: jest.fn().mockImplementation(() => {
      return {
        loadModel: jest.fn(),
      };
    }),
  };
});

const mockUseAppState = useAppState as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ isGalleryViewActive: false }));

describe('the VideoProvider component', () => {
  it('should correctly return the Video Context object', () => {
    const wrapper: React.FC = ({ children }) => (
      <VideoProvider onError={() => {}} options={{ dominantSpeaker: true }}>
        {children}
      </VideoProvider>
    );
    const { result } = renderHook(useVideoContext, { wrapper });
    const expectedSettings = {
      type: 'none',
      index: 0,
    };
    expect(result.current).toMatchObject({
      isConnecting: false,
      localTracks: [{ name: 'mockTrack' }],
      room: mockRoom,
      onError: expect.any(Function),
      connect: expect.any(Function),
      getLocalVideoTrack: expect.any(Function),
      getLocalAudioTrack: expect.any(Function),
      removeLocalVideoTrack: expect.any(Function),
      isAcquiringLocalTracks: true,
      toggleScreenShare: expect.any(Function),
      isBackgroundSelectionOpen: false,
      setIsBackgroundSelectionOpen: expect.any(Function),
      backgroundSettings: expectedSettings,
      setBackgroundSettings: expect.any(Function),
    });
    expect(useRoom).toHaveBeenCalledWith([{ name: 'mockTrack' }], expect.any(Function), {
      dominantSpeaker: true,
    });
    expect(useLocalTracks).toHaveBeenCalled();
    expect(useHandleRoomDisconnection).toHaveBeenCalledWith(
      mockRoom,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      false,
      expect.any(Function)
    );
    expect(useHandleTrackPublicationFailed).toHaveBeenCalledWith(mockRoom, expect.any(Function));
    expect(useRestartAudioTrackOnDeviceChange).toHaveBeenCalledWith(result.current.localTracks);
  });

  it('should call the onError function when there is an error', () => {
    const mockOnError = jest.fn();
    const wrapper: React.FC = ({ children }) => (
      <VideoProvider onError={mockOnError} options={{ dominantSpeaker: true }}>
        {children}
      </VideoProvider>
    );
    const { result } = renderHook(useVideoContext, { wrapper });
    result.current.onError({} as TwilioError);
    expect(mockOnError).toHaveBeenCalledWith({});
  });
});
