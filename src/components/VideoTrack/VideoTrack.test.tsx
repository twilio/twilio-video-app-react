import React from 'react';
import { render } from '@testing-library/react';
import VideoTrack from './VideoTrack';

describe('the VideoTrack component', () => {
  it('should call the attach method when the component mounts', () => {
    const mockTrack = { attach: jest.fn(), detach: jest.fn() } as any;
    render(<VideoTrack track={mockTrack} />);
    expect(mockTrack.attach).toHaveBeenCalledWith(expect.any(window.HTMLVideoElement));
    expect(mockTrack.detach).not.toHaveBeenCalled();
  });

  it('it should call the detach method when the component unmounts', () => {
    const mockTrack = { attach: jest.fn(), detach: jest.fn() } as any;
    const { unmount } = render(<VideoTrack track={mockTrack} />);
    unmount();
    expect(mockTrack.detach).toHaveBeenCalledWith(expect.any(window.HTMLVideoElement));
  });

  it('should flip the video horizontally if the track is local', () => {
    const mockTrack = { attach: jest.fn(), detach: jest.fn() } as any;
    const { container } = render(<VideoTrack track={mockTrack} isLocal />);
    expect(container.querySelector('video')!.style.transform).toEqual('rotateY(180deg)');
  });

  it('should not flip the video horizontally if the track is not local', () => {
    const mockTrack = { attach: jest.fn(), detach: jest.fn() } as any;
    const { container } = render(<VideoTrack track={mockTrack} />);
    expect(container.querySelector('video')!.style.transform).toEqual('');
  });
});
