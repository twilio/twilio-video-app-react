import React from 'react';
import { render } from '@testing-library/react';
import AudioTrack from './AudioTrack';

describe('the AudioTrack component', () => {
  it('should call the attach method when the component mounts', () => {
    const mockTrack = { attach: jest.fn(), detach: jest.fn() } as any;
    render(<AudioTrack track={mockTrack} />);
    expect(mockTrack.attach).toHaveBeenCalledWith(expect.any(window.HTMLAudioElement));
    expect(mockTrack.detach).not.toHaveBeenCalled();
  });

  it('it should call the detach method when the component unmounts', () => {
    const mockTrack = { attach: jest.fn(), detach: jest.fn() } as any;
    const { unmount } = render(<AudioTrack track={mockTrack} />);
    unmount();
    expect(mockTrack.detach).toHaveBeenCalledWith(expect.any(window.HTMLAudioElement));
  });
});
