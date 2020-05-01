import React from 'react';
import MainParticipantInfo from './MainParticipantInfo';
import { shallow } from 'enzyme';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');
jest.mock('../../hooks/useTrack/useTrack');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;
const mockUseTrack = useTrack as jest.Mock<any>;

describe('the MainParticipantInfo component', () => {
  beforeEach(jest.clearAllMocks);
  it('should render a VideoCamOff icon when no camera tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should not render a VideoCamOff icon when a camera track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(false);
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
});
