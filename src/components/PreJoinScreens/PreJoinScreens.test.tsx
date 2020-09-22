import React from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import { mount, shallow } from 'enzyme';
import PreflightTest from './PreflightTest/PreflightTest';
import PreJoinScreens from './PreJoinScreens';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useParams } from 'react-router-dom';
import { useAppState } from '../../state';

delete window.location;
// @ts-ignore
window.location = {
  pathname: '',
  search: '',
  origin: '',
};

const mockReplaceState = jest.fn();
Object.defineProperty(window.history, 'replaceState', { value: mockReplaceState });

jest.mock('../../state');
jest.mock('react-router-dom', () => ({ useParams: jest.fn() }));
const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseParams = useParams as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ user: { displayName: 'Test User' } }));
mockUseParams.mockImplementation(() => ({ URLRoomName: 'testRoom' }));

jest.mock('../IntroContainer/IntroContainer', () => ({ children }: { children: React.ReactNode }) => children);
jest.mock('./RoomNameScreen/RoomNameScreen', () => () => null);
jest.mock('./DeviceSelectionScreen/DeviceSelectionScreen', () => () => null);

describe('the PreJoinScreens component', () => {
  beforeEach(jest.clearAllMocks);

  it('should update the URL to include the room name on submit', () => {
    const wrapper = shallow(<PreJoinScreens />);

    const setRoomName = wrapper.find(RoomNameScreen).prop('setRoomName');
    setRoomName('Test Room 123');

    const handleSubmit = wrapper.find(RoomNameScreen).prop('handleSubmit');
    handleSubmit({ preventDefault: () => {} } as any);

    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/room/Test%20Room%20123');
  });

  it('should not update the URL when the app is deployed as a Twilio function', () => {
    // @ts-ignore
    window.location = { ...window.location, origin: 'https://video-app-1234-twil.io' };
    const wrapper = shallow(<PreJoinScreens />);

    const setRoomName = wrapper.find(RoomNameScreen).prop('setRoomName');
    setRoomName('Test Room 123');

    const handleSubmit = wrapper.find(RoomNameScreen).prop('handleSubmit');
    handleSubmit({ preventDefault: () => {} } as any);

    expect(window.history.replaceState).not.toHaveBeenCalled();
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

  it('should render the PreflightTest component only while on the DeviceSelection step', () => {
    const wrapper = shallow(<PreJoinScreens />);

    expect(wrapper.prop('subContent')).toBe(false);
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(false);

    const handleSubmit = wrapper.find(RoomNameScreen).prop('handleSubmit');
    handleSubmit({ preventDefault: () => {} } as any);

    expect(wrapper.prop('subContent')).toEqual(<PreflightTest />);
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(true);
  });

  it('should populate the Room name from the URL and switch to the DeviceSelectionScreen', () => {
    const wrapper = mount(<PreJoinScreens />);
    const roomName = wrapper.find(DeviceSelectionScreen).prop('roomName');
    expect(roomName).toBe('testRoom');

    expect(wrapper.find(RoomNameScreen).exists()).toBe(false);
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(true);
  });
});
