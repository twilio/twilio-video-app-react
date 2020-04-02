import React from 'react';
import { render } from '@testing-library/react';
import AudioTrack from './AudioTrack';

const audioEl = document.createElement('audio');
const mockTrack = { attach: jest.fn(() => audioEl), detach: jest.fn(() => [audioEl]) } as any;

describe('the AudioTrack component', () => {
  beforeEach(jest.clearAllMocks);

  it('should add an audio element to the DOM when the component mounts', () => {
    render(<AudioTrack track={mockTrack} />);
    expect(mockTrack.attach).toHaveBeenCalled();
    expect(mockTrack.detach).not.toHaveBeenCalled();
    expect(document.querySelector('audio')).toBe(audioEl);
  });

  it('should remove the audio element from the DOM when the component unmounts', () => {
    const { unmount } = render(<AudioTrack track={mockTrack} />);
    unmount();
    expect(mockTrack.detach).toHaveBeenCalled();
    expect(document.querySelector('audio')).toBe(null);
  });
});
