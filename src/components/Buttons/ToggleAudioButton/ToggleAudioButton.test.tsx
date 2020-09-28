import React from 'react';
import { shallow } from 'enzyme';
import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';

import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';
import ToggleAudioButton from './ToggleAudioButton';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

jest.mock('../../../hooks/useLocalAudioToggle/useLocalAudioToggle');
jest.mock('../../../hooks/useVideoContext/useVideoContext');
const mockUseLocalAudioToggle = useLocalAudioToggle as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the ToggleAudioButton component', () => {
  beforeAll(() => {
    mockUseVideoContext.mockImplementation(() => ({ localTracks: [{ kind: 'audio' }] }));
  });

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

  it('should render correctly when there are no audio tracks', () => {
    mockUseLocalAudioToggle.mockImplementation(() => [true, () => {}]);
    mockUseVideoContext.mockImplementationOnce(() => ({ localTracks: [{ kind: 'video' }] }));
    const wrapper = shallow(<ToggleAudioButton />);
    expect(wrapper.prop('startIcon')).toEqual(<MicIcon />);
    expect(wrapper.text()).toBe('No Audio');
    expect(wrapper.prop('disabled')).toEqual(true);
  });

  it('should call the correct toggle function when clicked', () => {
    const mockFn = jest.fn();
    mockUseLocalAudioToggle.mockImplementation(() => [false, mockFn]);
    const wrapper = shallow(<ToggleAudioButton />);
    wrapper.simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });
});
