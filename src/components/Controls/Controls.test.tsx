import React from 'react';
import { shallow } from 'enzyme';

import Controls from './Controls';
import useRoomState from '../../hooks/useRoomState/useRoomState';

jest.mock('../../hooks/useRoomState/useRoomState');

const mockUseRoomState = useRoomState as jest.Mock<any>;

describe('the Controls component', () => {
  it('should not render the ScreenShare and EndCall buttons when not connected to a room', () => {
    mockUseRoomState.mockImplementation(() => 'disconnected');
    const wrapper = shallow(<Controls />);
    expect(wrapper.find('ToggleScreenShareButton').exists()).toBe(false);
    expect(wrapper.find('EndCallButton').exists()).toBe(false);
  });

  it('should render the ScreenShare and EndCall buttons when connected to a room', () => {
    mockUseRoomState.mockImplementation(() => 'connected');
    const wrapper = shallow(<Controls />);
    expect(wrapper.find('ToggleScreenShareButton').exists()).toBe(true);
    expect(wrapper.find('EndCallButton').exists()).toBe(true);
  });
});
