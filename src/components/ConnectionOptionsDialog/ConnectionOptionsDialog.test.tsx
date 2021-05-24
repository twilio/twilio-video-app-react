import React from 'react';
import ConnectionOptionsDialog from './ConnectionOptionsDialog';
import { initialSettings } from '../../state/settings/settingsReducer';
import { Select, TextField } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';

jest.mock('../../hooks/useRoomState/useRoomState');
jest.mock('../../state');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRoomState = useRoomState as jest.Mock<any>;

const mockDispatchSetting = jest.fn();
mockUseAppState.mockImplementation(() => ({ settings: initialSettings, dispatchSetting: mockDispatchSetting }));

describe('the ConnectionOptionsDialog component', () => {
  afterEach(jest.clearAllMocks);

  describe('when not connected to a room', () => {
    mockUseRoomState.mockImplementation(() => 'disconnected');
    it('should render correctly', () => {
      const wrapper = shallow(<ConnectionOptionsDialog open={true} onClose={() => {}} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should dispatch settings changes', () => {
      const wrapper = shallow(<ConnectionOptionsDialog open={true} onClose={() => {}} />);
      wrapper
        .find(Select)
        .find({ name: 'dominantSpeakerPriority' })
        .simulate('change', { target: { value: 'testValue', name: 'dominantSpeakerPriority' } });
      expect(mockDispatchSetting).toHaveBeenCalledWith({ value: 'testValue', name: 'dominantSpeakerPriority' });
    });

    it('should not dispatch settings changes from a number field when there are non-digits in the value', () => {
      const wrapper = shallow(<ConnectionOptionsDialog open={true} onClose={() => {}} />);
      wrapper
        .find(TextField)
        .find({ name: 'maxAudioBitrate' })
        .simulate('change', { target: { value: '123456a', name: 'maxAudioBitrate' } });
      expect(mockDispatchSetting).not.toHaveBeenCalled();
    });

    it('should dispatch settings changes from a number field when there are only digits in the value', () => {
      const wrapper = shallow(<ConnectionOptionsDialog open={true} onClose={() => {}} />);
      wrapper
        .find(TextField)
        .find({ name: 'maxAudioBitrate' })
        .simulate('change', { target: { value: '123456', name: 'maxAudioBitrate' } });
      expect(mockDispatchSetting).toHaveBeenCalledWith({ value: '123456', name: 'maxAudioBitrate' });
    });
  });

  describe('when connected to a room', () => {
    mockUseRoomState.mockImplementation(() => 'connected');
    it('should render correctly', () => {
      const wrapper = shallow(<ConnectionOptionsDialog open={true} onClose={() => {}} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
