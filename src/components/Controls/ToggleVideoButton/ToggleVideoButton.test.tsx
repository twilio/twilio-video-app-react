import React from 'react';
import { shallow } from 'enzyme';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

import ToggleVideoButton from './ToggleVideoButton';

jest.mock('../../../hooks/useLocalVideoToggle/useLocalVideoToggle');

const mockUseLocalVideoToggle = useLocalVideoToggle as jest.Mock<any>;

describe('the ToggleVideoButton component', () => {
  it('should render correctly when video is enabled', () => {
    mockUseLocalVideoToggle.mockImplementation(() => [true, () => {}]);
    const wrapper = shallow(<ToggleVideoButton />);
    expect(wrapper.find('VideocamIcon').exists()).toBe(true);
    expect(wrapper.find('VideocamOffIcon').exists()).toBe(false);
    expect(wrapper.prop('title')).toBe('Mute Video');
  });

  it('should render correctly when video is disabled', () => {
    mockUseLocalVideoToggle.mockImplementation(() => [false, () => {}]);
    const wrapper = shallow(<ToggleVideoButton />);
    expect(wrapper.find('VideocamIcon').exists()).toBe(false);
    expect(wrapper.find('VideocamOffIcon').exists()).toBe(true);
    expect(wrapper.prop('title')).toBe('Unmute Video');
  });

  it('should call the correct toggle function when clicked', () => {
    const mockFn = jest.fn();
    mockUseLocalVideoToggle.mockImplementation(() => [false, mockFn]);
    const wrapper = shallow(<ToggleVideoButton />);
    wrapper.find('WithStyles(ForwardRef(Fab))').simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });

  it('should throttle the toggle function to 200ms', () => {
    const mockFn = jest.fn();
    mockUseLocalVideoToggle.mockImplementation(() => [false, mockFn]);
    const wrapper = shallow(<ToggleVideoButton />);
    const button = wrapper.find('WithStyles(ForwardRef(Fab))');
    Date.now = () => 100000;
    button.simulate('click'); // Should register
    Date.now = () => 100100;
    button.simulate('click'); // Should be ignored
    Date.now = () => 100300;
    button.simulate('click'); // Should register
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
