import React from 'react';
import { mount } from 'enzyme';
import RecordingNotifications from './RecordingNotifications';
import Snackbar from '../Snackbar/Snackbar';
import useIsRecording from '../../hooks/useIsRecording/useIsRecording';

jest.mock('../../hooks/useIsRecording/useIsRecording');
const mockUseIsRecording = useIsRecording as jest.Mock<boolean | null>;

describe('the RecordingNotification component', () => {
  beforeEach(() => mockUseIsRecording.mockImplementation(() => null));

  it('should not display a notification when recording is not in progress', () => {
    const wrapper = mount(<RecordingNotifications />);
    expect(
      wrapper
        .find(Snackbar)
        .find({ open: true })
        .exists()
    ).toBe(false);
  });

  it('should display "Recording In Progress" Snackbar when a user joins a room and recording is in progress', () => {
    mockUseIsRecording.mockImplementation(() => true);
    const wrapper = mount(<RecordingNotifications />);

    expect(
      wrapper
        .find('Snackbar')
        .find({ open: true })
        .first()
        .prop('headline')
    ).toMatchInlineSnapshot(`"Recording is in progress."`);
  });

  it('should display "Recording Started" Snackbar when a recording is started after a user joins a room', () => {
    const wrapper = mount(<RecordingNotifications />);
    mockUseIsRecording.mockImplementation(() => false);
    wrapper.setProps({}); // Set value of prevIsRecording.current

    mockUseIsRecording.mockImplementation(() => true);
    wrapper.setProps({}); // Set value of prevIsRecording.current
    wrapper.setProps({}); // Trigger re-render now that prevIsRecording.current is set

    expect(
      wrapper
        .find('Snackbar')
        .find({ open: true })
        .first()
        .prop('headline')
    ).toMatchInlineSnapshot(`"Recording has started."`);
  });

  it('should display "Recording Complete" Snackbar when a recording stops ', () => {
    mockUseIsRecording.mockImplementation(() => true);
    const wrapper = mount(<RecordingNotifications />);

    mockUseIsRecording.mockImplementation(() => false);
    wrapper.setProps({}); // Set value of prevIsRecording.current
    wrapper.setProps({}); // Trigger re-render now that prevIsRecording.current is set

    expect(
      wrapper
        .find('Snackbar')
        .find({ open: true })
        .first()
        .prop('headline')
    ).toMatchInlineSnapshot(`"Recording Complete"`);
  });
});
