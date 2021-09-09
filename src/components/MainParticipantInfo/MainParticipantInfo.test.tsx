import React from 'react';

import MainParticipantInfo from './MainParticipantInfo';
import AvatarIcon from '../../icons/AvatarIcon';
import { shallow } from 'enzyme';

import useIsRecording from '../../hooks/useIsRecording/useIsRecording';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useParticipantIsReconnecting from '../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');
jest.mock('../../hooks/useTrack/useTrack');
jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting');
jest.mock('../../hooks/useIsRecording/useIsRecording');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;
const mockUseTrack = useTrack as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseParticipantIsReconnecting = useParticipantIsReconnecting as jest.Mock<boolean>;
const mockUseIsRecording = useIsRecording as jest.Mock<boolean>;

describe('the MainParticipantInfo component', () => {
  beforeEach(jest.clearAllMocks);

  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({ room: { localParticipant: {} } }));
    mockUsePublications.mockImplementation(() => [{ trackName: '', kind: 'video' }]);
    mockUseTrack.mockImplementation((track: any) => track);
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
  });

  it('should render the AvatarIcon component when no video tracks are published', () => {
    mockUsePublications.mockImplementationOnce(() => []);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find(AvatarIcon).exists()).toBe(true);
  });

  it('should not render the AvatarIcon component when video tracks are published', () => {
    mockUsePublications.mockImplementationOnce(() => [{ trackName: '', kind: 'video' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find(AvatarIcon).exists()).toBe(false);
  });

  it('should not render the AvatarIcon component when the user has disabled their video and is sharing their screen', () => {
    mockUsePublications.mockImplementationOnce(() => [{ trackName: 'screen-123456' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find(AvatarIcon).exists()).toBe(false);
  });

  it('should render the AvatarIcon component when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementationOnce(() => true);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find(AvatarIcon).exists()).toBe(true);
  });

  it('should not render the reconnecting UI when the user is connected', () => {
    mockUseParticipantIsReconnecting.mockImplementationOnce(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: '', kind: 'video' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.text()).not.toContain('Reconnecting...');
  });

  it('should render the reconnecting UI when the user is reconnecting', () => {
    mockUseParticipantIsReconnecting.mockImplementationOnce(() => true);
    mockUsePublications.mockImplementation(() => [{ trackName: '', kind: 'video' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.text()).toContain('Reconnecting...');
  });

  it('should use the switchOff status of the screen share track when it is available', () => {
    mockUsePublications.mockImplementationOnce(() => [{ trackName: 'screen' }, { trackName: '', kind: 'video' }]);
    shallow(<MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>);
    expect(mockUseTrack).toHaveBeenCalledWith({ trackName: 'screen' });
  });

  it('should use the switchOff status of the camera track when the screen share track is not available', () => {
    mockUsePublications.mockImplementationOnce(() => [{ trackName: '', kind: 'video' }]);
    shallow(<MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>);
    expect(mockUseTrack).toHaveBeenCalledWith({ trackName: '', kind: 'video' });
  });

  it('should add "(You)" to the participants identity when they are the localParticipant', () => {
    const mockParticipant = { identity: 'mockIdentity' } as any;
    mockUseVideoContext.mockImplementationOnce(() => ({ room: { localParticipant: mockParticipant } }));
    const wrapper = shallow(<MainParticipantInfo participant={mockParticipant}>mock children</MainParticipantInfo>);
    expect(wrapper.text()).toContain('mockIdentity (You)');
  });

  it('should not add "(You)" to the participants identity when they are the localParticipant', () => {
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.text()).not.toContain('mockIdentity (You)');
  });

  it('should add "- Screen" to the participants identity when they are screen sharing', () => {
    mockUsePublications.mockImplementationOnce(() => [
      { trackName: 'screen', kind: 'video' },
      { trackName: '', kind: 'video' },
    ]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.text()).toContain('mockIdentity - Screen');
  });

  it('should not render the recording indicator when isRecording is false', () => {
    mockUseIsRecording.mockImplementationOnce(() => false);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.text()).not.toContain('Recording');
  });

  it('should render the recording indicator when isRecording is true', () => {
    mockUseIsRecording.mockImplementationOnce(() => true);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.text()).toContain('Recording');
  });
});
