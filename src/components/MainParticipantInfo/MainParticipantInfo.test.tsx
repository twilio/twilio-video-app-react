import React from 'react';
import MainParticipantInfo from './MainParticipantInfo';
import { shallow } from 'enzyme';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');

const mockUsePublications = usePublications as jest.Mock<any>;

const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;

describe('the MainParticipantInfo component', () => {
  it('should render a VideoCamOff icon when no camera tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should not render a VideoCamOff icon when a camera track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(false);
  });

  it('should add isSwitchedOff prop to Container component when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).toContain('isVideoSwitchedOff');
  });

  it('should not add isSwitchedOff prop to Container component when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <MainParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</MainParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).not.toContain('isVideoSwitchedOff');
  });
});
