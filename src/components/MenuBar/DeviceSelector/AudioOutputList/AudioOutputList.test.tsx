import React from 'react';
import AudioOutputList from './AudioOutputList';
import { Select, Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useAudioOutputDevices } from '../deviceHooks/deviceHooks';
import { useAppState } from '../../../../state';

jest.mock('../../../../state');
jest.mock('../deviceHooks/deviceHooks');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseAudioOutputDevices = useAudioOutputDevices as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ activeSinkId: '123' }));

const mockDevice = {
  deviceId: '123',
  label: 'mock device',
};

describe('the AudioOutputList component', () => {
  it('should display the name of the active output device if only one is available', () => {
    mockUseAudioOutputDevices.mockImplementation(() => [mockDevice]);
    const wrapper = shallow(<AudioOutputList />);
    expect(wrapper.find(Select).exists()).toBe(false);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe('mock device');
  });

  it('should display "System Default Audio Output" when no audio output devices are available', () => {
    mockUseAudioOutputDevices.mockImplementation(() => []);
    const wrapper = shallow(<AudioOutputList />);
    expect(wrapper.find(Select).exists()).toBe(false);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe('System Default Audio Output');
  });

  it('should display a Select menu when multiple audio output devices are available', () => {
    mockUseAudioOutputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    const wrapper = shallow(<AudioOutputList />);
    expect(wrapper.find(Select).exists()).toBe(true);
  });
});
