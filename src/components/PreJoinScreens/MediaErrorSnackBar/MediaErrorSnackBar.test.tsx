import React from 'react';
import MediaErrorSnackBar from './MediaErrorSnackBar';
import { shallow } from 'enzyme';
import { useHasAudioInputDevices, useHasVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

jest.mock('../../../hooks/useVideoContext/useVideoContext');
jest.mock('../../../hooks/deviceHooks/deviceHooks');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseHasAudioInputDevices = useHasAudioInputDevices as jest.Mock<any>;
const mockUseHasVideoInputDevices = useHasVideoInputDevices as jest.Mock<any>;

describe('the MediaErrorSnackBar', () => {
  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({ isAcquiringLocalTracks: false }));
    mockUseHasAudioInputDevices.mockImplementation(() => true);
    mockUseHasVideoInputDevices.mockImplementation(() => true);
  });

  it('should be closed by default', () => {
    const wrapper = shallow(<MediaErrorSnackBar />);
    expect(wrapper.prop('open')).toBe(false);
  });

  it('should open when there is an error', () => {
    const wrapper = shallow(<MediaErrorSnackBar error={new Error('testError')} />);
    expect(wrapper.prop('open')).toBe(true);
  });

  it('should open when there are no audio devices', () => {
    mockUseHasAudioInputDevices.mockImplementationOnce(() => false);
    const wrapper = shallow(<MediaErrorSnackBar />);
    expect(wrapper.prop('open')).toBe(true);
  });

  it('should open when there are no video devices', () => {
    mockUseHasVideoInputDevices.mockImplementationOnce(() => false);
    const wrapper = shallow(<MediaErrorSnackBar />);
    expect(wrapper.prop('open')).toBe(true);
  });

  it('should not open when there local tracks are being acquired', () => {
    mockUseVideoContext.mockImplementation(() => ({ isAcquiringLocalTracks: true }));
    const wrapper = shallow(<MediaErrorSnackBar error={new Error('testError')} />);
    expect(wrapper.prop('open')).toBe(false);
  });

  it('should close after the handleClose function is called', () => {
    const wrapper = shallow(<MediaErrorSnackBar error={new Error('testError')} />);
    expect(wrapper.prop('open')).toBe(true);
    wrapper.prop('handleClose')(); // Close snackbar
    expect(wrapper.prop('open')).toBe(false);
  });
});
