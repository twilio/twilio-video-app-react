import React from 'react';
import AboutDialog from '../../AboutDialog/AboutDialog';
import { Button, MenuItem } from '@material-ui/core';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FlipCameraIcon from '../../../icons/FlipCameraIcon';
import Menu from './Menu';
import MenuContainer from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import { shallow } from 'enzyme';
import { render, fireEvent, waitForElementToBeRemoved, waitForElement } from '@testing-library/react';
import useFlipCameraToggle from '../../../hooks/useFlipCameraToggle/useFlipCameraToggle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useAppState } from '../../../state';
import useIsRecording from '../../../hooks/useIsRecording/useIsRecording';

jest.mock('../../../hooks/useFlipCameraToggle/useFlipCameraToggle');
jest.mock('@material-ui/core/useMediaQuery');
jest.mock('../../../state');
jest.mock('../../../hooks/useVideoContext/useVideoContext', () => () => ({ room: { sid: 'mockRoomSid' } }));
jest.mock('../../../hooks/useIsRecording/useIsRecording');

const mockUseFlipCameraToggle = useFlipCameraToggle as jest.Mock<any>;
const mockUseMediaQuery = useMediaQuery as jest.Mock<boolean>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseIsRecording = useIsRecording as jest.Mock<boolean>;

describe('the Menu component', () => {
  let mockUpdateRecordingRules: jest.Mock<any>;

  beforeEach(() => jest.clearAllMocks());

  beforeAll(() => {
    mockUpdateRecordingRules = jest.fn(() => Promise.resolve());
    mockUseAppState.mockImplementation(() => ({ isFetching: false, updateRecordingRules: mockUpdateRecordingRules }));
  });

  describe('the recording button', () => {
    describe('while recording is in progress', () => {
      beforeAll(() => {
        mockUseIsRecording.mockImplementation(() => true);
      });

      it('should display "Stop Recording"', () => {
        const { getByText } = render(<Menu />);
        fireEvent.click(getByText('More'));

        expect(getByText('Stop Recording')).toBeTruthy();
      });

      it('should update recording rules and display the snackbar when the user clicks on the Stop Recording button', () => {
        const { getByText } = render(<Menu />);
        fireEvent.click(getByText('More'));

        fireEvent.click(getByText('Stop Recording'));

        expect(mockUpdateRecordingRules).toHaveBeenCalledWith('mockRoomSid', [{ all: true, type: 'exclude' }]);
        waitForElement(() => getByText('You can view the recording in the Twilio Console'));
      });
    });

    describe('while recording is not in progress', () => {
      beforeAll(() => {
        mockUseIsRecording.mockImplementation(() => false);
      });

      it('should display "Start Recording"', () => {
        const { getByText } = render(<Menu />);
        fireEvent.click(getByText('More'));

        expect(getByText('Start Recording')).toBeTruthy();
      });

      it('should open a dialog box when clicked', () => {
        const { getByText } = render(<Menu />);
        fireEvent.click(getByText('More'));

        fireEvent.click(getByText('Start Recording'));
        expect(getByText('Continue')).toBeTruthy();
      });

      it('should update recording rules when the user confirms the dialog box', () => {
        const { getByText } = render(<Menu />);
        fireEvent.click(getByText('More'));

        fireEvent.click(getByText('Start Recording'));
        fireEvent.click(getByText('Continue'));
        expect(mockUpdateRecordingRules).toHaveBeenCalledWith('mockRoomSid', [{ all: true, type: 'include' }]);
      });

      it('should disable the Start Recording button when isFetching is true', async () => {
        mockUseAppState.mockImplementationOnce(() => ({ isFetching: true }));
        const wrapper = shallow(<Menu />);

        expect(
          wrapper
            .find(MenuItem)
            .at(0)
            .prop('disabled')
        ).toBe(true);
      });

      it('should close the dialog box when Cancel is clicked', () => {
        const { queryByText, getByText } = render(<Menu />);

        fireEvent.click(getByText('More'));

        fireEvent.click(getByText('Start Recording'));
        fireEvent.click(getByText('Cancel'));
        return expect(waitForElementToBeRemoved(() => queryByText('Continue'))).resolves.toBe(true);
      });
    });
  });

  describe('on desktop devices', () => {
    beforeAll(() => {
      mockUseMediaQuery.mockImplementation(() => false);
      mockUseFlipCameraToggle.mockImplementation(() => ({
        flipCameraDisabled: false,
        flipCameraSupported: false,
      }));
    });

    it('should open the Menu when the Button is clicked', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(MenuContainer).prop('open')).toBe(false);
      wrapper.find(Button).simulate('click');
      expect(wrapper.find(MenuContainer).prop('open')).toBe(true);
    });

    it('should open the AboutDialog when the About button is clicked', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(AboutDialog).prop('open')).toBe(false);
      wrapper
        .find(MenuItem)
        .at(2)
        .simulate('click');
      expect(wrapper.find(AboutDialog).prop('open')).toBe(true);
    });

    it('should open the DeviceSelectionDialog when the Settings button is clicked', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(DeviceSelectionDialog).prop('open')).toBe(false);
      wrapper
        .find(MenuItem)
        .at(0)
        .simulate('click');
      expect(wrapper.find(DeviceSelectionDialog).prop('open')).toBe(true);
    });

    it('should render the correct icon', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(ExpandMoreIcon).exists()).toBe(true);
      expect(wrapper.find(MoreIcon).exists()).toBe(false);
    });

    it('should not render the Flip Camera button', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(FlipCameraIcon).exists()).toBe(false);
    });
  });

  describe('on mobile devices', () => {
    beforeAll(() => {
      mockUseMediaQuery.mockImplementation(() => true);
      mockUseFlipCameraToggle.mockImplementation(() => ({
        flipCameraDisabled: false,
        flipCameraSupported: true,
      }));
    });

    it('should render the correct icon', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(ExpandMoreIcon).exists()).toBe(false);
      expect(wrapper.find(MoreIcon).exists()).toBe(true);
    });

    it('should render non-disabled Flip Camera button when flipCameraSupported is true', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(FlipCameraIcon).exists()).toBe(true);
      expect(
        wrapper
          .find(MenuItem)
          .at(0)
          .prop('disabled')
      ).toBe(false);
    });

    it('should render a disabled Flip Camera button when flipCameraSupported is true, and flipCameraDisabled is true', () => {
      mockUseFlipCameraToggle.mockImplementationOnce(() => ({
        flipCameraDisabled: true,
        flipCameraSupported: true,
      }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(FlipCameraIcon).exists()).toBe(true);
      expect(
        wrapper
          .find(MenuItem)
          .at(0)
          .prop('disabled')
      ).toBe(true);
    });

    it('should not render Flip Camera button when flipCameraSupported is false', () => {
      mockUseFlipCameraToggle.mockImplementationOnce(() => ({
        flipCameraSupported: false,
      }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(FlipCameraIcon).exists()).toBe(false);
    });
  });
});
