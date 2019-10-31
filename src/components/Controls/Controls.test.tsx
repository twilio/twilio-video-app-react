import React from 'react';
import { receiveToken } from '../../store/main/main';
import { shallow } from 'enzyme';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useRoomState from '../../hooks/useRoomState/useRoomState';

import Controls from './Controls';

jest.mock('../../hooks/useLocalAudioToggle/useLocalAudioToggle');
jest.mock('../../hooks/useLocalVideoToggle/useLocalVideoToggle');
jest.mock('../../hooks/useRoomState/useRoomState');
jest.mock('../../store/main/main');
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));

const mockUseLocalAudioToggle = useLocalAudioToggle as jest.Mock<any>;
const mockUseLocalVideoToggle = useLocalVideoToggle as jest.Mock<any>;
const mockUseRoomState = useRoomState as jest.Mock<any>;

describe('the Controls component', () => {
  beforeEach(() => {
    mockUseLocalAudioToggle.mockImplementation(() => [true, () => {}]);
    mockUseLocalVideoToggle.mockImplementation(() => [true, () => {}]);
  });

  describe('End Call button', () => {
    it('should not render when not connected to a room', () => {
      const wrapper = shallow(<Controls />);
      expect(wrapper.find('CallEndIcon').exists()).toBe(false);
    });

    it('should render when connected to a room', () => {
      mockUseRoomState.mockImplementation(() => 'connected');
      const wrapper = shallow(<Controls />);
      expect(wrapper.find('CallEndIcon').exists()).toBe(true);
    });

    it('should delete the token from redux when clicked', () => {
      mockUseRoomState.mockImplementation(() => 'connected');
      const wrapper = shallow(<Controls />);
      wrapper
        .find('WithStyles(ForwardRef(Tooltip))')
        .at(2)
        .simulate('click');
      expect(receiveToken).toHaveBeenCalledWith('');
    });
  });

  it('should render correctly when audio is enabled', () => {
    mockUseLocalAudioToggle.mockImplementation(() => [true, () => {}]);
    const wrapper = shallow(<Controls />);
    expect(wrapper.find('MicIcon').exists()).toBe(true);
    expect(wrapper.find('MicOffIcon').exists()).toBe(false);
    expect(
      wrapper
        .find('WithStyles(ForwardRef(Tooltip))')
        .at(0)
        .prop('title')
    ).toBe('Mute Audio');
  });

  it('should render correctly when audio is disabled', () => {
    mockUseLocalAudioToggle.mockImplementation(() => [false, () => {}]);
    const wrapper = shallow(<Controls />);
    expect(wrapper.find('MicIcon').exists()).toBe(false);
    expect(wrapper.find('MicOffIcon').exists()).toBe(true);
    expect(
      wrapper
        .find('WithStyles(ForwardRef(Tooltip))')
        .at(0)
        .prop('title')
    ).toBe('Unmute Audio');
  });

  it('should render correctly when video is enabled', () => {
    mockUseLocalVideoToggle.mockImplementation(() => [true, () => {}]);
    const wrapper = shallow(<Controls />);
    expect(wrapper.find('VideocamIcon').exists()).toBe(true);
    expect(wrapper.find('VideocamOffIcon').exists()).toBe(false);
    expect(
      wrapper
        .find('WithStyles(ForwardRef(Tooltip))')
        .at(1)
        .prop('title')
    ).toBe('Mute Video');
  });

  it('should render correctly when video is disabled', () => {
    mockUseLocalVideoToggle.mockImplementation(() => [false, () => {}]);
    const wrapper = shallow(<Controls />);
    expect(wrapper.find('VideocamIcon').exists()).toBe(false);
    expect(wrapper.find('VideocamOffIcon').exists()).toBe(true);
    expect(
      wrapper
        .find('WithStyles(ForwardRef(Tooltip))')
        .at(1)
        .prop('title')
    ).toBe('Unmute Video');
  });
});
