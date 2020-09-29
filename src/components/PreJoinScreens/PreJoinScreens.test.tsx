import React from 'react';
import { act } from 'react-dom/test-utils';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import { mount, shallow } from 'enzyme';
import PreflightTest from './PreflightTest/PreflightTest';
import PreJoinScreens from './PreJoinScreens';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useParams } from 'react-router-dom';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Video from 'twilio-video';

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
jest.mock('../../hooks/useVideoContext/useVideoContext');
const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseParams = useParams as jest.Mock<any>;
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

    expect(wrapper.prop('subContent')).toEqual(
      <>
        <PreflightTest />
        <MediaErrorSnackbar />
      </>
    );
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(true);
  });

  it('should not render the PreflightTest component when the Video.testPreflight function does not exist', () => {
    // Save the testPreflight function
    const testPreflightFunction = Video.testPreflight;

    // @ts-ignore
    delete Video.testPreflight;
    const wrapper = shallow(<PreJoinScreens />);

    expect(wrapper.prop('subContent')).toBe(false);
    expect(wrapper.find(DeviceSelectionScreen).exists()).toBe(false);

    const handleSubmit = wrapper.find(RoomNameScreen).prop('handleSubmit');
    handleSubmit({ preventDefault: () => {} } as any);

    expect(wrapper.prop('subContent')).toEqual(
      <>
        {undefined}
        <MediaErrorSnackbar />
      </>
    );

    // Restore the testPreflight function to the mock
    Video.testPreflight = testPreflightFunction;
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
    mockUseVideoContext.mockImplementation(() => ({ getAudioAndVideoTracks: () => Promise.reject('testError') }));

    const wrapper = mount(<PreJoinScreens />);

    // This may look odd, but it prevents 'An update to PreJoinScreens inside a test was not wrapped in act(...)' warning.
    await act(async () => {
      await new Promise(setImmediate);
      wrapper.update();
    });

    const error = wrapper.children().prop('subContent').props.children[1].props.error;
    expect(error).toBe('testError');
  });
});
