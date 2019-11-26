import React from 'react';
import ReconnectingNotification from './ReconnectingNotification';
import { shallow } from 'enzyme';
import useRoomState from '../../hooks/useRoomState/useRoomState';

jest.mock('../../hooks/useRoomState/useRoomState');
const mockUseRoomState = useRoomState as jest.Mock<string>;

describe('the ReconnectingNotification component', () => {
  it('should not open Snackbar when room state is not "reconnecting"', () => {
    mockUseRoomState.mockImplementation(() => 'connected');
    const wrapper = shallow(<ReconnectingNotification />);
    expect(wrapper.find({ open: false }).exists()).toBe(true);
  });

  it('should open Snackbar when room state is "reconnecting"', () => {
    mockUseRoomState.mockImplementation(() => 'reconnecting');
    const wrapper = shallow(<ReconnectingNotification />);
    expect(wrapper.find({ open: true }).exists()).toBe(true);
  });
});
