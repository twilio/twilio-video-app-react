import React from 'react';
import { shallow } from 'enzyme';
import useLocalAudioToggle from '../../../../hooks/useLocalAudioToggle/useLocalAudioToggle';

import MicIcon from '../../../../icons/MicIcon';
import MicOffIcon from '../../../../icons/MicOffIcon';
import ToggleAudioButton from './ToggleAudioButton';

jest.mock('../../../../hooks/useLocalAudioToggle/useLocalAudioToggle');

const mockUseLocalAudioToggle = useLocalAudioToggle as jest.Mock<any>;

describe('the ToggleAudioButton component', () => {
  it('should render correctly when audio is enabled', () => {
    mockUseLocalAudioToggle.mockImplementation(() => [true, () => {}]);
    const wrapper = shallow(<ToggleAudioButton />);
    expect(wrapper.prop('startIcon')).toEqual(<MicIcon />);
    expect(wrapper.text()).toBe('Mute');
  });

  it('should render correctly when audio is disabled', () => {
    mockUseLocalAudioToggle.mockImplementation(() => [false, () => {}]);
    const wrapper = shallow(<ToggleAudioButton />);
    expect(wrapper.prop('startIcon')).toEqual(<MicOffIcon />);
    expect(wrapper.text()).toBe('Unmute');
  });

  it('should call the correct toggle function when clicked', () => {
    const mockFn = jest.fn();
    mockUseLocalAudioToggle.mockImplementation(() => [false, mockFn]);
    const wrapper = shallow(<ToggleAudioButton />);
    wrapper.simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });
});
