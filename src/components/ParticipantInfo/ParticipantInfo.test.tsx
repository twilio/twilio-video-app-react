import React from 'react';
import ParticipantInfo from './ParticipantInfo';
import PinIcon from './PinIcon/PinIcon';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  it('should display ScreenShare icon when participant has published a screen share track', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'screen' }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('ScreenShareIcon').exists()).toEqual(true);
  });

  it('should not display ScreenShare icon when participant has not published a screen share track', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('ScreenShareIcon').exists()).toEqual(false);
  });

  it('should add hideVideoProp to InfoContainer component when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-infoContainer-3').prop('className')).toContain('hideVideo');
  });

  it('should not add hideVideoProp to InfoContainer component when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-infoContainer-3').prop('className')).not.toContain('hideVideo');
  });

  it('should render a VideoCamOff icon when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should not render a VideoCamOff icon when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(false);
  });

  it('should add isSwitchedOff prop to Container component when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).toContain('isVideoSwitchedOff');
  });

  it('should not add isSwitchedOff prop to Container component when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).not.toContain('isVideoSwitchedOff');
  });

  it('should render the PinIcon component when the participant is selected', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={true} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.exists(PinIcon)).toBe(true);
  });

  it('should not render the PinIcon component when the participant is not selected', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.exists(PinIcon)).toBe(false);
  });
});
