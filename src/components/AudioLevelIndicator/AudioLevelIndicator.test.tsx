import React from 'react';
import { shallow } from 'enzyme';

import AudioLevelIndicator from './AudioLevelIndicator';
import MicOff from '@material-ui/icons/MicOff';
import useIsTrackEnabled from '../../hooks/useIsTrackEnabled/useIsTrackEnabled';

jest.mock('../../hooks/useIsTrackEnabled/useIsTrackEnabled');

const mockUseIsTrackEnabled = useIsTrackEnabled as jest.Mock<boolean>;

describe('the AudioLevelIndicator component', () => {
  it('should render a MicOff icon when the audioTrack is not enabled', () => {
    mockUseIsTrackEnabled.mockImplementationOnce(() => false);
    const wrapper = shallow(<AudioLevelIndicator />);
    expect(wrapper.exists(MicOff)).toBe(true);
  });

  it('should not render a MicOff icon when the audioTrack is enabled', () => {
    mockUseIsTrackEnabled.mockImplementationOnce(() => true);
    const wrapper = shallow(<AudioLevelIndicator />);
    expect(wrapper.exists(MicOff)).toBe(false);
    expect(wrapper.exists('svg')).toBe(true);
  });

  it('should change the size of the indicator when the size prop is used', () => {
    mockUseIsTrackEnabled.mockImplementationOnce(() => true);
    const wrapper = shallow(<AudioLevelIndicator size={35} />);
    expect(wrapper.find({ width: '35px', height: '35px' }).exists()).toBeTruthy();
  });

  it('should change the background of the indicator when background prop is used', () => {
    mockUseIsTrackEnabled.mockImplementationOnce(() => true);
    const wrapper = shallow(<AudioLevelIndicator background="#123456" />);
    expect(wrapper.find({ fill: '#123456' }).exists()).toBeTruthy();
  });
});
