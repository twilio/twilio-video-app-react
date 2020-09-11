import React from 'react';

import MainParticipantInfo from './MainParticipantInfo';
import AvatarIcon from '../../icons/AvatarIcon';
import { shallow } from 'enzyme';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');
jest.mock('../../hooks/useTrack/useTrack');
jest.mock('../../hooks/useVideoContext/useVideoContext');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;
const mockUseTrack = useTrack as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the MainParticipantInfo component', () => {
  beforeEach(jest.clearAllMocks);

  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({ room: { localParticipant: {} } }));
  });

  it('should render the AvatarIcon component when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find(AvatarIcon).exists()).toBe(true);
  });

  it('should render not the AvatarIcon component when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find(AvatarIcon).exists()).toBe(false);
  });

  it('should add isVideoSwitchedOff class to container div when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).toContain('isVideoSwitchedOff');
  });

  it('should not add isVideoSwitchedOff class to container div when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).not.toContain('isVideoSwitchedOff');
  });

  it('should use the switchOff status of the screen share track when it is available', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'screen' }, { trackName: 'camera-123456' }]);
    shallow(<MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>);
    expect(mockUseTrack).toHaveBeenCalledWith({ trackName: 'screen' });
  });

  it('should use the switchOff status of the camera track when the screen share track is not available', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    shallow(<MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>);
    expect(mockUseTrack).toHaveBeenCalledWith({ trackName: 'camera-123456' });
  });

  it('should add "(You)" to the participants identity when they are the localParticipant', () => {
    const mockParticipant = { identity: 'mockIdentity' } as any;
    mockUseVideoContext.mockImplementationOnce(() => ({ room: { localParticipant: mockParticipant } }));
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    const wrapper = shallow(<MainParticipantInfo participant={mockParticipant}>mock children</MainParticipantInfo>);
    expect(wrapper.text()).toContain('mockIdentity (You)');
  });

  it('should not add "(You)" to the participants identity when they are the localParticipant', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.text()).not.toContain('mockIdentity (You)');
  });
});
