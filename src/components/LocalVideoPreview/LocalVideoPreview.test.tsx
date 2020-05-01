import React from 'react';
import { render } from '@testing-library/react';
import LocalVideoPreview from './LocalVideoPreview';
import { IVideoContext } from '../VideoProvider';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/useVideoContext/useVideoContext');

const mockedVideoContext = useVideoContext as jest.Mock<IVideoContext>;

describe('the LocalVideoPreview component', () => {
  it('it should render a VideoTrack component when there is a "camera" track', () => {
    mockedVideoContext.mockImplementation(() => {
      return {
        localTracks: [
          {
            name: 'camera-123456',
            attach: jest.fn(),
            detach: jest.fn(),
            mediaStreamTrack: { getSettings: () => ({}) },
          },
        ],
      } as any;
    });
    const { container } = render(<LocalVideoPreview />);
    expect(container.firstChild).toEqual(expect.any(window.HTMLVideoElement));
  });

  it('should render null when there are no "camera" tracks', () => {
    mockedVideoContext.mockImplementation(() => {
      return {
        localTracks: [{ name: 'microphone', attach: jest.fn(), detach: jest.fn() }],
      } as any;
    });
    const { container } = render(<LocalVideoPreview />);
    expect(container.firstChild).toEqual(null);
  });
});
