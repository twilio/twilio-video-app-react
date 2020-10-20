import React from 'react';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '../../../constants';
import { Select, Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import VideoInputList from './VideoInputList';

jest.mock('../../../hooks/useVideoContext/useVideoContext');
jest.mock('../../../hooks/deviceHooks/deviceHooks');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseVideoInputDevices = useVideoInputDevices as jest.Mock<any>;
const mockGetLocalVideotrack = jest.fn(() => Promise.resolve);

const mockDevice = {
  deviceId: '123',
  label: 'mock device',
};

const mockLocalTrack = {
  kind: 'video',
  mediaStreamTrack: {
    label: 'mock local video track',
    getSettings: () => ({ deviceId: '234' }),
  },
  restart: jest.fn(),
};

mockUseVideoContext.mockImplementation(() => ({
  room: {},
  getLocalVideoTrack: mockGetLocalVideotrack,
  localTracks: [mockLocalTrack],
}));

describe('the VideoInputList component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  describe('with only one video input device', () => {
    it('should not display a Select menu and instead display the name of the local video track', () => {
      mockUseVideoInputDevices.mockImplementation(() => [mockDevice]);
      const wrapper = shallow(<VideoInputList />);
      expect(wrapper.find(Select).exists()).toBe(false);
      expect(
        wrapper
          .find(Typography)
          .at(1)
          .text()
      ).toBe('mock local video track');
    });

    it('should display "No Local Video" when there is no local video track', () => {
      mockUseVideoInputDevices.mockImplementation(() => [mockDevice]);
      mockUseVideoContext.mockImplementationOnce(() => ({
        room: {},
        getLocalVideoTrack: mockGetLocalVideotrack,
        localTracks: [],
      }));
      const wrapper = shallow(<VideoInputList />);
      expect(
        wrapper
          .find(Typography)
          .at(1)
          .text()
      ).toBe('No Local Video');
    });
  });

  it('should render a Select menu when there are multiple video input devices', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    const wrapper = shallow(<VideoInputList />);
    expect(wrapper.find(Select).exists()).toBe(true);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .exists()
    ).toBe(false);
  });

  it('should save the deviceId in localStorage when the video input device is changed', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    const wrapper = shallow(<VideoInputList />);
    expect(window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)).toBe(undefined);
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)).toBe('mockDeviceID');
  });

  it('should call track.restart with the new deviceId when the video input device is changed', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    const wrapper = shallow(<VideoInputList />);
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(mockLocalTrack.restart).toHaveBeenCalledWith({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: 'mockDeviceID' },
    });
  });
});
