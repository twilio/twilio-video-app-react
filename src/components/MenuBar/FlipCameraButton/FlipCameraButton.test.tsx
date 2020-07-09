import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import FlipCameraButton from './FlipCameraButton';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { VIDEO_TRACK_WIDTH, VIDEO_TRACK_HEIGHT, VIDEO_TRACK_FRAMERATE } from '../../../constants';

jest.mock('../../../hooks/useMediaStreamTrack/useMediaStreamTrack');
jest.mock('../../../hooks/useVideoContext/useVideoContext');
const mockUserVideoContext = useVideoContext as jest.Mock<any>;

const mockLocalParticipant = {
  emit: jest.fn(),
  publishTrack: jest.fn(),
  unpublishTrack: jest.fn(() => 'mockPublication'),
};

const mockStreamSettings = { facingMode: 'user' };

const mockVideoTrack = {
  name: 'camera',
  mediaStreamTrack: {
    getSettings: () => mockStreamSettings,
  },
  stop: jest.fn(),
  restart: jest.fn(),
};

const mockVideoContext = {
  room: {
    localParticipant: mockLocalParticipant,
  },
  localTracks: [mockVideoTrack],
  getLocalVideoTrack: jest.fn(() => Promise.resolve('newMockTrack')),
};

describe('the FlipCameraButton', () => {
  beforeEach(jest.clearAllMocks);

  it('should render a button when a video track exists and has the facingMode setting', () => {
    mockUserVideoContext.mockImplementation(() => mockVideoContext);
    const { container } = render(<FlipCameraButton />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('not render a button when the video track does not have the facingMode setting', () => {
    mockUserVideoContext.mockImplementation(() => ({
      ...mockVideoContext,
      localTracks: [
        {
          ...mockVideoTrack,
          mediaStreamTrack: {
            getSettings: () => ({}),
          },
        },
      ],
    }));
    const { container } = render(<FlipCameraButton />);
    expect(container.querySelector('button')).not.toBeTruthy();
  });

  it('should not render a button when no video track is present', () => {
    mockUserVideoContext.mockImplementation(() => ({
      ...mockVideoContext,
      localTracks: [],
    }));
    const { container } = render(<FlipCameraButton />);
    expect(container.querySelector('button')).not.toBeTruthy();
  });

  it('should request the front facing video track when the current track is rear facing when clicked', async () => {
    mockUserVideoContext.mockImplementation(() => ({
      ...mockVideoContext,
      localTracks: [
        {
          ...mockVideoTrack,
          mediaStreamTrack: {
            getSettings: () => ({ facingMode: 'environment' }),
          },
        },
      ],
    }));
    const { container } = render(<FlipCameraButton />);
    fireEvent.click(container.querySelector('button')!);
    expect(mockVideoTrack.restart).toHaveBeenCalledWith({
      facingMode: 'user',
      width: VIDEO_TRACK_WIDTH,
      height: VIDEO_TRACK_HEIGHT,
      frameRate: VIDEO_TRACK_FRAMERATE,
    });
  });
});
