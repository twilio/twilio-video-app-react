import React from 'react';
import { render } from '@testing-library/react';
import VideoTrack from './VideoTrack';

describe('the VideoTrack component', () => {
  const mockTrack = {
    attach: jest.fn(),
    detach: jest.fn(),
    setPriority: jest.fn(),
    mediaStreamTrack: { getSettings: () => ({}) },
  } as any;

  afterEach(jest.clearAllMocks);

  it('should call the attach method when the component mounts', () => {
    render(<VideoTrack track={mockTrack} />);
    expect(mockTrack.attach).toHaveBeenCalledWith(expect.any(window.HTMLVideoElement));
    expect(mockTrack.detach).not.toHaveBeenCalled();
  });

  it('it should call the detach method when the component unmounts', () => {
    const { unmount } = render(<VideoTrack track={mockTrack} />);
    unmount();
    expect(mockTrack.detach).toHaveBeenCalledWith(expect.any(window.HTMLVideoElement));
  });

  it('should flip the video horizontally if the track is local', () => {
    const { container } = render(<VideoTrack track={mockTrack} isLocal />);
    expect(container.querySelector('video')!.style.transform).toEqual('rotateY(180deg)');
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
      attach: jest.fn(),
      detach: jest.fn(),
      setPriority: jest.fn(),
      mediaStreamTrack: { getSettings: () => ({}) },
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
