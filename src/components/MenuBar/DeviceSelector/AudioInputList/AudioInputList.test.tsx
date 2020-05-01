import React from 'react';
import AudioInputList from './AudioInputList';
import { Select, Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useAudioInputDevices } from '../deviceHooks/deviceHooks';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';

jest.mock('../../../../hooks/useVideoContext/useVideoContext');
jest.mock('../deviceHooks/deviceHooks');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseAudioInputDevices = useAudioInputDevices as jest.Mock<any>;
const mockGetLocalAudiotrack = jest.fn(() => Promise.resolve);

const mockDevice = {
  deviceId: '123',
  label: 'mock device',
};

const mockLocalTrack = {
  kind: 'audio',
  mediaStreamTrack: {
    label: 'mock local audio track',
    getSettings: () => ({ deviceId: '234' }),
  },
};

mockUseVideoContext.mockImplementation(() => ({
  room: {},
  getLocalAudioTrack: mockGetLocalAudiotrack,
  localTracks: [mockLocalTrack],
}));

describe('the AudioInputList component', () => {
  it('should display the name of the local audio track when only one is avaiable', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice]);
    const wrapper = shallow(<AudioInputList />);
    expect(wrapper.find(Select).exists()).toBe(false);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe('mock local audio track');
  });

  it('should display "No Local Audio" when there is no local audio track', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice]);
    mockUseVideoContext.mockImplementationOnce(() => ({
      room: {},
      getLocalAudioTrack: mockGetLocalAudiotrack,
      localTracks: [],
    }));
    const wrapper = shallow(<AudioInputList />);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe('No Local Audio');
  });

  it('should render a Select menu when there are multiple audio input devices', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    const wrapper = shallow(<AudioInputList />);
    expect(wrapper.find(Select).exists()).toBe(true);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .exists()
    ).toBe(false);
  });
});
