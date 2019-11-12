import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useAdaptiveBandwidthProfile from './useAdaptiveBandwidthProfile/useAdaptiveBandwidthProfile';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';
import { VideoProvider, useVideoContext } from './index';

jest.mock('./useRoom/useRoom', () => jest.fn(() => ({ room: 'mockRoom', isConnecting: false })));
jest.mock('./useLocalTracks/useLocalTracks', () => jest.fn(() => ['mockTrack']));
jest.mock('./useAdaptiveBandwidthProfile/useAdaptiveBandwidthProfile', () => jest.fn());

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
      room: 'mockRoom',
    });
    expect(useRoom).toHaveBeenCalledWith(['mockTrack'], 'mockToken', {
      dominantSpeaker: true,
    });
    expect(useLocalTracks).toHaveBeenCalled();
  });

  it('should use the useAdaptiveBandwidthProfile hook', () => {
    const wrapper: React.FC = ({ children }) => (
      <VideoProvider token="mockToken" options={{ dominantSpeaker: true }}>
        {children}
      </VideoProvider>
    );
    renderHook(useVideoContext, { wrapper });
    expect(useAdaptiveBandwidthProfile).toHaveBeenCalled();
  });
});
