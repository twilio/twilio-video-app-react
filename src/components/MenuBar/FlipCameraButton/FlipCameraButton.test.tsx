import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import FlipCameraButton from './FlipCameraButton';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

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
};

const mockVideoContext = {
  room: {
    localParticipant: mockLocalParticipant,
  },
  localTracks: [mockVideoTrack],
  getLocalVideoTrack: jest.fn(() => Promise.resolve('newMockTrack')),
};

describe('the FlipCameraButton', () => {
  afterEach(jest.clearAllMocks);

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

  it('should unpublish the front facing video track and publish the rear facing track when clicked', async () => {
    mockUserVideoContext.mockImplementation(() => mockVideoContext);
    const { container } = render(<FlipCameraButton />);
    fireEvent.click(container.querySelector('button')!);
    expect(mockVideoTrack.stop).toHaveBeenCalled();
    await expect(mockVideoContext.getLocalVideoTrack).toHaveBeenCalledWith({ facingMode: 'environment' });
    expect(mockLocalParticipant.unpublishTrack).toHaveBeenCalledWith(mockVideoTrack);
    expect(mockLocalParticipant.emit).toHaveBeenCalledWith('trackUnpublished', 'mockPublication');
    expect(mockLocalParticipant.publishTrack).toHaveBeenCalledWith('newMockTrack', { priority: 'low' });
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
    expect(mockVideoContext.getLocalVideoTrack).toHaveBeenCalledWith({ facingMode: 'user' });
  });
});
