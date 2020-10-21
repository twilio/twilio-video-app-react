import React from 'react';
import AudioInputList from './AudioInputList';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_AUDIO_INPUT_KEY } from '../../../constants';
import { Select, Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useAudioInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

jest.mock('../../../hooks/useVideoContext/useVideoContext');
jest.mock('../../../hooks/deviceHooks/deviceHooks');

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
  restart: jest.fn(),
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

  it('should save the deviceId in localStorage when the audio input device is changed', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    const wrapper = shallow(<AudioInputList />);
    expect(window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY)).toBe(undefined);
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY)).toBe('mockDeviceID');
  });

  it('should call track.restart with the new deviceId when the audio input device is changed', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    const wrapper = shallow(<AudioInputList />);
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(mockLocalTrack.restart).toHaveBeenCalledWith({
      deviceId: { exact: 'mockDeviceID' },
    });
  });
});
