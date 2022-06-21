import React from 'react';
import { render } from '@testing-library/react';
import VideoTrack from './VideoTrack';
import useVideoTrackDimensions from '../../hooks/useVideoTrackDimensions/useVideoTrackDimensions';

jest.mock('../../hooks/useMediaStreamTrack/useMediaStreamTrack');

jest.mock('../../hooks/useVideoTrackDimensions/useVideoTrackDimensions');
const mockUseVideoTrackDimensions = useVideoTrackDimensions as jest.Mock<any>;
mockUseVideoTrackDimensions.mockImplementation(() => ({ width: 200, height: 100 }));

describe('the VideoTrack component', () => {
  const mockTrack = {
    attach: jest.fn(),
    detach: jest.fn(),
    setPriority: jest.fn(),
    mediaStreamTrack: { getSettings: () => ({}) },
    name: 'camera',
  } as any;

  afterEach(jest.clearAllMocks);

  it('should call the attach method when the component mounts', () => {
    render(<VideoTrack track={mockTrack} />);
    expect(mockTrack.attach).toHaveBeenCalledWith(expect.any(window.HTMLVideoElement));
    expect(mockTrack.detach).not.toHaveBeenCalled();
  });

  it('should have "object-fit: cover" applied when the track is a camera track', () => {
    const { container } = render(<VideoTrack track={mockTrack} />);
    expect(container.querySelector('video')!.style).toMatchObject({ objectFit: 'cover' });
  });

  it('should have "object-fit: contain" applied when the track is a screen track', () => {
    const mockTrack2 = {
      ...mockTrack,
      name: 'screen',
    } as any;
    const { container } = render(<VideoTrack track={mockTrack2} />);
    expect(container.querySelector('video')!.style).toMatchObject({ objectFit: 'contain' });
  });

  it('should have "object-fit: contain" applied when the track is a camera track in portrait orientation', () => {
    mockUseVideoTrackDimensions.mockImplementationOnce(() => ({ width: 100, height: 200 }));
    const { container } = render(<VideoTrack track={mockTrack} />);
    expect(container.querySelector('video')!.style).toMatchObject({ objectFit: 'contain' });
  });

  it('it should call the detach method when the component unmounts', () => {
    const { unmount } = render(<VideoTrack track={mockTrack} />);
    unmount();
    expect(mockTrack.detach).toHaveBeenCalledWith(expect.any(window.HTMLVideoElement));
  });

  it('should set the video elements srcObject to null when the component unmounts', () => {
    const { unmount, container } = render(<VideoTrack track={mockTrack} />);
    const videoEl = container.querySelector('video')!;
    unmount();
    expect(videoEl.srcObject).toBe(null);
  });

  it('should flip the video horizontally if the track is local', () => {
    const { container } = render(<VideoTrack track={mockTrack} isLocal />);
    expect(container.querySelector('video')!.style.transform).toEqual('scaleX(-1)');
  });

  it('should not flip the video horizontally if the track is the local rear-facing camera', () => {
    const mockTrack2 = {
      ...mockTrack,
      mediaStreamTrack: {
        getSettings: () => ({ facingMode: 'environment' }),
      },
    };
    const { container } = render(<VideoTrack track={mockTrack2} isLocal />);
    expect(container.querySelector('video')!.style.transform).toEqual('');
  });

  it('should not flip the video horizontally if the track is not local', () => {
    const { container } = render(<VideoTrack track={mockTrack} />);
    expect(container.querySelector('video')!.style.transform).toEqual('');
  });

  it('should set the track priority when it is attached', () => {
    render(<VideoTrack track={mockTrack} priority="high" />);
    expect(mockTrack.setPriority).toHaveBeenCalledWith('high');
  });

  it('should set the track priority to "null" when it is detached and set the priority of the new track', () => {
    const mockTrack2 = {
      ...mockTrack,
    } as any;
    const { rerender } = render(<VideoTrack track={mockTrack} priority="high" />);
    expect(mockTrack.setPriority).toHaveBeenCalledWith('high');
    rerender(<VideoTrack track={mockTrack2} priority="high" />);
    expect(mockTrack.setPriority).toHaveBeenCalledWith(null);
    expect(mockTrack2.setPriority).toHaveBeenCalledWith('high');
  });

  it('should set the track priority to "null" when it is unmounted', () => {
    const { unmount } = render(<VideoTrack track={mockTrack} priority="high" />);
    expect(mockTrack.setPriority).toHaveBeenCalledWith('high');
    unmount();
    expect(mockTrack.setPriority).toHaveBeenCalledWith(null);
  });

  it('should not set the track priority on mount or unmount when no priority is specified', () => {
    const { unmount } = render(<VideoTrack track={mockTrack} />);
    unmount();
    expect(mockTrack.setPriority).not.toHaveBeenCalled();
  });
});
