import React from 'react';
import MediaErrorSnackBar, { getSnackbarContent } from './MediaErrorSnackbar';
import { shallow } from 'enzyme';
import useDevices from '../../../hooks/useDevices/useDevices';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

jest.mock('../../../hooks/useVideoContext/useVideoContext');
jest.mock('../../../hooks/useDevices/useDevices');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseDevices = useDevices as jest.Mock<any>;

describe('the MediaErrorSnackBar', () => {
  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({ isAcquiringLocalTracks: false }));
    mockUseDevices.mockImplementation(() => ({ hasAudioInputDevices: true, hasVideoInputDevices: true }));
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
    mockUseDevices.mockImplementation(() => ({ hasAudioInputDevices: false, hasVideoInputDevices: true }));
    const wrapper = shallow(<MediaErrorSnackBar />);
    expect(wrapper.prop('open')).toBe(true);
  });

  it('should open when there are no video devices', () => {
    mockUseDevices.mockImplementation(() => ({ hasAudioInputDevices: true, hasVideoInputDevices: false }));
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

describe('the getSnackbarContent function', () => {
  it('return empty strings by default', () => {
    const results = getSnackbarContent(true, true);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "",
        "message": "",
      }
    `);
  });

  it('should return the correct content when there are no audio devices', () => {
    const results = getSnackbarContent(false, true);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "No Microphone Detected:",
        "message": "Other participants in the room will be unable to hear you.",
      }
    `);
  });

  it('should return the correct content when there are no video devices', () => {
    const results = getSnackbarContent(true, false);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "No Camera Detected:",
        "message": "Other participants in the room will be unable to see you.",
      }
    `);
  });

  it('should return the correct content when there are no audio or video devices', () => {
    const results = getSnackbarContent(false, false);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "No Camera or Microphone Detected:",
        "message": "Other participants in the room will be unable to see and hear you.",
      }
    `);
  });

  it('should return the correct content when there is a NotAllowedError', () => {
    const error = new Error();
    error.name = 'NotAllowedError';
    const results = getSnackbarContent(true, true, error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Unable to Access Media:",
        "message": "The user has denied permission to use audio and video. Please grant permission to the browser to access the microphone and camera.",
      }
    `);
  });

  it('should return the correct content when there is a NotAllowedError with "Permission denied by syste" message', () => {
    const error = new Error('Permission denied by system');
    error.name = 'NotAllowedError';
    const results = getSnackbarContent(true, true, error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Unable to Access Media:",
        "message": "The operating system has blocked the browser from accessing the microphone or camera. Please check your operating system settings.",
      }
    `);
  });

  it('should return the correct content when there is a NotFoundError', () => {
    const error = new Error();
    error.name = 'NotFoundError';
    const results = getSnackbarContent(true, true, error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Cannot Find Microphone or Camera:",
        "message": "The browser cannot access the microphone or camera. Please make sure all input devices are connected and enabled.",
      }
    `);
  });

  it('should return the correct content when there is any other kind of error', () => {
    const error = new Error('Any other device errors');
    error.name = 'OtherDeviceError';
    const results = getSnackbarContent(true, true, error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Error Acquiring Media:",
        "message": "OtherDeviceError Any other device errors",
      }
    `);
  });

  it('should return the correct content when there is a CameraPermissionsDenied error', () => {
    const error = new Error('CameraPermissionsDenied');
    const results = getSnackbarContent(true, true, error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Unable to Access Media:",
        "message": "The user has denied permission to use video. Please grant permission to the browser to access the camera.",
      }
    `);
  });

  it('should return the correct content when there is a MicrophonePermissionsDenied error', () => {
    const error = new Error('MicrophonePermissionsDenied');
    const results = getSnackbarContent(true, true, error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Unable to Access Media:",
        "message": "The user has denied permission to use audio. Please grant permission to the browser to access the microphone.",
      }
    `);
  });
});
