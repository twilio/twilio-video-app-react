import { EventEmitter } from 'events';
import React from 'react';
import { shallow } from 'enzyme';
import useScreenShareParticipant from '../../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useScreenShareToggle from '../../../hooks/useScreenShareToggle/useScreenShareToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

import ToggleScreenShareButton, {
  SCREEN_SHARE_TEXT,
  STOP_SCREEN_SHARE_TEXT,
  SHARE_IN_PROGRESS_TEXT,
  SHARE_NOT_SUPPORTED_TEXT,
} from './ToggleScreenShareButton';

jest.mock('../../../hooks/useScreenShareToggle/useScreenShareToggle');
jest.mock('../../../hooks/useScreenShareParticipant/useScreenShareParticipant');
jest.mock('../../../hooks/useVideoContext/useVideoContext');

const mockUseScreenShareToggle = useScreenShareToggle as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

mockUseVideoContext.mockImplementation(() => ({ room: new EventEmitter() }));

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getDisplayMedia: () => {},
  },
  configurable: true,
});

describe('the ToggleScreenShareButton component', () => {
  it('should render correctly when screenSharing is allowed', () => {
    mockUseScreenShareToggle.mockImplementation(() => [false, () => {}]);
    const wrapper = shallow(<ToggleScreenShareButton />);
    expect(wrapper.find('ScreenShareIcon').exists()).toBe(true);
    expect(wrapper.prop('title')).toBe(SCREEN_SHARE_TEXT);
  });

  it('should render correctly when the user is sharing their screen', () => {
    mockUseScreenShareToggle.mockImplementation(() => [true, () => {}]);
    const wrapper = shallow(<ToggleScreenShareButton />);
    expect(wrapper.find('StopScreenShareIcon').exists()).toBe(true);
    expect(wrapper.prop('title')).toBe(STOP_SCREEN_SHARE_TEXT);
  });

  it('should render correctly when another user is sharing their screen', () => {
    mockUseScreenShareParticipant.mockImplementation(() => 'mockParticipant');
    mockUseScreenShareToggle.mockImplementation(() => [false, () => {}]);
    const wrapper = shallow(<ToggleScreenShareButton />);
    expect(wrapper.find('WithStyles(ForwardRef(Fab))').prop('disabled')).toBe(true);
    expect(wrapper.prop('title')).toBe(SHARE_IN_PROGRESS_TEXT);
  });

  it('should call the correct toggle function when clicked', () => {
    const mockFn = jest.fn();
    mockUseScreenShareToggle.mockImplementation(() => [false, mockFn]);
    const wrapper = shallow(<ToggleScreenShareButton />);
    wrapper.find('WithStyles(ForwardRef(Fab))').simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });

  it('should render the screenshare button with the correct messaging if screensharing is not supported', () => {
    Object.defineProperty(navigator, 'mediaDevices', { value: { getDisplayMedia: undefined } });
    const wrapper = shallow(<ToggleScreenShareButton />);
    expect(wrapper.find('ScreenShareIcon').exists()).toBe(true);
    expect(wrapper.find('WithStyles(ForwardRef(Fab))').prop('disabled')).toBe(true);
    expect(wrapper.prop('title')).toBe(SHARE_NOT_SUPPORTED_TEXT);
  });
});
