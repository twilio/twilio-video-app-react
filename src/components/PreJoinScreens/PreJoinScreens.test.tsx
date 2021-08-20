import React from 'react';
import { act } from 'react-dom/test-utils';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import { mount, shallow } from 'enzyme';
import PreJoinScreens from './PreJoinScreens';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useParams } from 'react-router-dom';
import { useAppState } from '../../state';
import { useHistory, useLocation } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useHistory: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('../../state');
jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('./MediaErrorSnackbar/MediaErrorSnackbar', () => () => null);

const mockUseParams = useParams as jest.Mock<any>;
const mockUseLocation = useLocation as jest.Mock<any>;
const mockUseHistory = useHistory as jest.Mock<any>;
const mockReplace = jest.fn();
mockUseHistory.mockImplementation(() => ({ replace: mockReplace }));

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

jest.mock('../IntroContainer/IntroContainer', () => ({ children }: { children: React.ReactNode }) => children);
jest.mock('./RoomNameScreen/RoomNameScreen', () => () => null);
jest.mock('./DeviceSelectionScreen/DeviceSelectionScreen', () => () => null);

describe('the PreJoinScreens component', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    mockUseAppState.mockImplementation(() => ({ user: { displayName: 'Test User' } }));
    mockUseParams.mockImplementation(() => ({ URLRoomName: 'testRoom' }));
    mockUseVideoContext.mockImplementation(() => ({ getAudioAndVideoTracks: () => Promise.resolve() }));
  });

  it('should update the URL to include the room name on submit', () => {
    mockUseLocation.mockImplementation(() => ({ search: '?test=123' }));
    const wrapper = shallow(<PreJoinScreens />);

    const setRoomName = wrapper.find(RoomNameScreen).prop('setRoomName');
    setRoomName('Test Room 123');

    const handleSubmit = wrapper.find(RoomNameScreen).prop('handleSubmit');
    handleSubmit({ preventDefault: () => {} } as any);

    expect(mockReplace).toHaveBeenCalledWith('/room/Test Room 123?test=123');
  });

  it('should switch to the DeviceSelection screen when a room name is submitted', () => {
    const wrapper = shallow(<PreJoinScreens />);

    expect(wrapper.find(RoomNameScreen).exists()).toBe(true);
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(false);

    const handleSubmit = wrapper.find(RoomNameScreen).prop('handleSubmit');
    handleSubmit({ preventDefault: () => {} } as any);

    expect(wrapper.find(RoomNameScreen).exists()).toBe(false);
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(true);
  });

  it('should populate the room name from the URL and switch to the DeviceSelectionScreen when the displayName is present for the user', () => {
    const wrapper = mount(<PreJoinScreens />);
    const roomName = wrapper.find(DeviceSelectionScreen).prop('roomName');
    expect(roomName).toBe('testRoom');

    expect(wrapper.find(RoomNameScreen).exists()).toBe(false);
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(true);
  });

  it('should populate the room name from the URL and stay on the RoomNameScreen when the displayName is not present for the user', () => {
    mockUseAppState.mockImplementation(() => ({ user: {} }));
    const wrapper = mount(<PreJoinScreens />);
    const roomName = wrapper.find(RoomNameScreen).prop('roomName');
    expect(roomName).toBe('testRoom');

    expect(wrapper.find(RoomNameScreen).exists()).toBe(true);
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(false);
  });

  it('should capture errors from getAudioAndVideoTracks and pass them to the MediaErrorSnackbar component', async () => {
    const mockGetAudioAndVideoTracks = jest.fn(() => Promise.reject('testError'));
    mockUseVideoContext.mockImplementation(() => ({ getAudioAndVideoTracks: mockGetAudioAndVideoTracks }));

    const wrapper = mount(<PreJoinScreens />);

    // This may look odd, but it prevents 'An update to PreJoinScreens inside a test was not wrapped in act(...)' warning.
    await act(async () => {
      await new Promise(setImmediate);
      wrapper.update();
    });

    const error = wrapper.find(MediaErrorSnackbar).prop('error');
    expect(error).toBe('testError');
    expect(mockGetAudioAndVideoTracks).toHaveBeenCalledTimes(1); // This makes sure that 'getAudioAndVideoTracks' isn't called repeatedly
  });
});
