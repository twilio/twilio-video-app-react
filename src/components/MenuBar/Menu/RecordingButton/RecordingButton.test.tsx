import React from 'react';
import { MenuItem } from '@material-ui/core';
import RecordingButton from './RecordingButton';
import { shallow, ShallowWrapper } from 'enzyme';
import { useAppState } from '../../../../state';
import useIsRecording from '../../../../hooks/useIsRecording/useIsRecording';

const mockUseIsRecording = useIsRecording as jest.Mock<boolean>;
const mockUseAppState = useAppState as jest.Mock<any>;

jest.mock('../../../../state');
jest.mock('../../../../hooks/useIsRecording/useIsRecording');
jest.mock('../../../../hooks/useVideoContext/useVideoContext', () => () => ({ room: { sid: 'mockSid' } }));

const mockUpdateRecordingRules = jest.fn(() => Promise.resolve());
const mockOnClick = jest.fn();
const mockSetIsRecordingSnackbarOpen = jest.fn();

describe('the RecordingButton component', () => {
  describe('when isRecording is false', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
      jest.clearAllMocks();
      mockUseIsRecording.mockImplementation(() => false);
      mockUseAppState.mockImplementation(() => ({ isFetching: false, updateRecordingRules: mockUpdateRecordingRules }));

      wrapper = shallow(
        <RecordingButton onClick={mockOnClick} setIsRecordingSnackbarOpen={mockSetIsRecordingSnackbarOpen} />
      );
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchInlineSnapshot(`
            <WithStyles(ForwardRef(MenuItem))
              disabled={false}
              onClick={[Function]}
            >
              <Styled(div)>
                <StartRecordingIcon />
              </Styled(div)>
              <WithStyles(ForwardRef(Typography))
                variant="body1"
              >
                Start
                 Recording
              </WithStyles(ForwardRef(Typography))>
            </WithStyles(ForwardRef(MenuItem))>
          `);
    });

    it('should correctly call updateRecordingRules when clicked', () => {
      wrapper.simulate('click');
      expect(mockUpdateRecordingRules).toHaveBeenCalledWith('mockSid', [{ all: true, type: 'include' }]);
    });

    it('should correctly call setIsRecordingSnackbarOpen when clicked', () => {
      wrapper.simulate('click');
      expect(mockSetIsRecordingSnackbarOpen).toHaveBeenCalledWith(false);
    });

    it('should not call setIsRecordingSnackbarOpen after recordingRules have been updated', done => {
      wrapper.simulate('click');
      setTimeout(() => {
        expect(mockSetIsRecordingSnackbarOpen).toHaveBeenCalledTimes(1);
        expect(mockSetIsRecordingSnackbarOpen).toHaveBeenLastCalledWith(false);
        done();
      });
    });
  });

  describe('when isRecording is true', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
      jest.clearAllMocks();
      mockUseIsRecording.mockImplementation(() => true);
      mockUseAppState.mockImplementation(() => ({ isFetching: false, updateRecordingRules: mockUpdateRecordingRules }));

      wrapper = shallow(
        <RecordingButton onClick={mockOnClick} setIsRecordingSnackbarOpen={mockSetIsRecordingSnackbarOpen} />
      );
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchInlineSnapshot(`
        <WithStyles(ForwardRef(MenuItem))
          disabled={false}
          onClick={[Function]}
        >
          <Styled(div)>
            <StopRecordingIcon />
          </Styled(div)>
          <WithStyles(ForwardRef(Typography))
            variant="body1"
          >
            Stop
             Recording
          </WithStyles(ForwardRef(Typography))>
        </WithStyles(ForwardRef(MenuItem))>
      `);
    });

    it('should correctly call updateRecordingRules when clicked', () => {
      wrapper.simulate('click');
      expect(mockUpdateRecordingRules).toHaveBeenCalledWith('mockSid', [{ all: true, type: 'exclude' }]);
    });

    it('should correctly call setIsRecordingSnackbarOpen when clicked', () => {
      wrapper.simulate('click');
      expect(mockSetIsRecordingSnackbarOpen).toHaveBeenCalledWith(false);
    });

    it('should correctly call setIsRecordingSnackbarOpen after recordingRules have been updated', done => {
      wrapper.simulate('click');
      setTimeout(() => {
        expect(mockSetIsRecordingSnackbarOpen).toHaveBeenCalledTimes(2);
        expect(mockSetIsRecordingSnackbarOpen).toHaveBeenLastCalledWith(true);
        done();
      });
    });
  });

  it('should be disabled when isFetching is true', () => {
    mockUseAppState.mockImplementationOnce(() => ({
      isFetching: true,
      updateRecordingRules: mockUpdateRecordingRules,
    }));

    const wrapper = shallow(
      <RecordingButton onClick={mockOnClick} setIsRecordingSnackbarOpen={mockSetIsRecordingSnackbarOpen} />
    );

    expect(wrapper.find(MenuItem).prop('disabled')).toBe(true);
  });

  it('should call onClick when clicked', () => {
    const wrapper = shallow(
      <RecordingButton onClick={mockOnClick} setIsRecordingSnackbarOpen={mockSetIsRecordingSnackbarOpen} />
    );

    wrapper.simulate('click');

    expect(mockOnClick).toHaveBeenCalled();
  });
});
