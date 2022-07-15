import React from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen';
import CircularProgress from '@material-ui/core/CircularProgress';
import { shallow } from 'enzyme';
import { Steps } from '../PreJoinScreens';
import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import { setImmediate } from 'timers';

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

const mockConnect = jest.fn();
const mockChatConnect = jest.fn(() => Promise.resolve());
const mockGetToken = jest.fn(() => Promise.resolve({ token: 'mockToken' }));

jest.mock('../../../hooks/useChatContext/useChatContext', () => () => ({ connect: mockChatConnect }));
jest.mock('../../../hooks/useVideoContext/useVideoContext');
jest.mock('../../../state');

mockUseAppState.mockImplementation(() => ({ getToken: mockGetToken, isFetching: false }));
mockUseVideoContext.mockImplementation(() => ({
  connect: mockConnect,
  isAcquiringLocalTracks: false,
  isConnecting: false,
}));

describe('the DeviceSelectionScreen component', () => {
  beforeEach(() => {
    process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS = 'false';
    jest.clearAllMocks();
  });

  describe('when connecting to a room', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({
      connect: mockConnect,
      isAcquiringLocalTracks: false,
      isConnecting: true,
    }));

    const wrapper = shallow(<DeviceSelectionScreen name="test name" roomName="test room name" setStep={() => {}} />);

    it('should show the loading screen', () => {
      expect(wrapper.find(CircularProgress).exists()).toBe(true);
    });

    it('should disable the desktop and mobile toggle video buttons', () => {
      expect(wrapper.find(ToggleVideoButton).every({ disabled: true })).toBe(true);
    });

    it('should disable the desktop and mobile toggle audio buttons', () => {
      expect(wrapper.find(ToggleAudioButton).every({ disabled: true })).toBe(true);
    });
  });

  describe('when acquiring local tracks', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({
      connect: mockConnect,
      isAcquiringLocalTracks: true,
      isConnecting: false,
    }));

    const wrapper = shallow(<DeviceSelectionScreen name="test name" roomName="test room name" setStep={() => {}} />);

    it('should disable the Join Now, toggle video, and toggle audio buttons', () => {
      expect(wrapper.find({ children: 'Join Now' }).prop('disabled')).toBe(true);
    });

    it('should disable the desktop and mobile toggle video buttons', () => {
      expect(wrapper.find(ToggleVideoButton).every({ disabled: true })).toBe(true);
    });

    it('should disable the desktop and mobile toggle audio buttons', () => {
      expect(wrapper.find(ToggleAudioButton).every({ disabled: true })).toBe(true);
    });
  });

  describe('when fetching a token', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({
      connect: mockConnect,
      isAcquiringLocalTracks: false,
      isConnecting: false,
    }));
    mockUseAppState.mockImplementationOnce(() => ({ getToken: mockGetToken, isFetching: true }));
    const wrapper = shallow(<DeviceSelectionScreen name="test name" roomName="test room name" setStep={() => {}} />);

    it('should show the loading screen', () => {
      expect(wrapper.find(CircularProgress).exists()).toBe(true);
    });

    it('should disable the desktop and mobile toggle video buttons', () => {
      expect(wrapper.find(ToggleVideoButton).every({ disabled: true })).toBe(true);
    });

    it('should disable the desktop and mobile toggle audio buttons', () => {
      expect(wrapper.find(ToggleAudioButton).every({ disabled: true })).toBe(true);
    });
  });

  it('should not disable the Join Now button by default', () => {
    const wrapper = shallow(<DeviceSelectionScreen name="test name" roomName="test room name" setStep={() => {}} />);
    expect(wrapper.find({ children: 'Join Now' }).prop('disabled')).toBe(false);
  });

  it('should go back to the RoomNameScreen when the Cancel button is clicked', () => {
    const mockSetStep = jest.fn();
    const wrapper = shallow(<DeviceSelectionScreen name="test name" roomName="test room name" setStep={mockSetStep} />);
    wrapper.find({ children: 'Cancel' }).simulate('click');
    expect(mockSetStep).toHaveBeenCalledWith(Steps.roomNameStep);
  });

  it('should fetch a token and connect to the Video SDK and Conversations SDK when the Join Now button is clicked', done => {
    const wrapper = shallow(<DeviceSelectionScreen name="test name" roomName="test room name" setStep={() => {}} />);
    wrapper.find({ children: 'Join Now' }).simulate('click');

    expect(mockGetToken).toHaveBeenCalledWith('test name', 'test room name');
    setImmediate(() => {
      expect(mockConnect).toHaveBeenCalledWith('mockToken');
      expect(mockChatConnect).toHaveBeenCalledWith('mockToken');
      done();
    });
  });

  it('should fetch a token and connect to the Video SDK only when the Join Now button is clicked when the REACT_APP_DISABLE_TWILIO_CONVERSATIONS variable is true', done => {
    process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS = 'true';
    const wrapper = shallow(<DeviceSelectionScreen name="test name" roomName="test room name" setStep={() => {}} />);
    wrapper.find({ children: 'Join Now' }).simulate('click');

    expect(mockGetToken).toHaveBeenCalledWith('test name', 'test room name');
    setImmediate(() => {
      expect(mockConnect).toHaveBeenCalledWith('mockToken');
      expect(mockChatConnect).not.toHaveBeenCalledWith('mockToken');
      done();
    });
  });
});
