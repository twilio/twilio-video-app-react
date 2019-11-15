import React from 'react';
import ParticipantInfo from './ParticipantInfo';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';

import { InfoContainer } from './ParticipantInfo';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  it('should display MicOff icon when microphone is disabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'microphone', isTrackEnabled: false }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(true);
  });

  it('should not display MicOff icon when microphone is enabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'microphone', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(false);
  });

  it('should display ScreenShare icon when participant has published a screen share track', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'screen', isTrackEnabled: true }]);
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

  it('should add hideVideoProp to InfoContainer component when video is disabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: false }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find(InfoContainer).prop('hideVideo')).toEqual(true);
  });

  it('should not add hideVideoProp to InfoContainer component when video is enabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find(InfoContainer).prop('hideVideo')).toEqual(false);
  });

  it('should render a VideoCamOff icon when no camera tracks are present', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should render a VideoCamOff icon when a camera track is present and disabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: false }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should render a VideoCamOff icon when a camera tracks is present and enabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(false);
  });

  it('should add isSwitchedOff prop to Container component when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.prop('isSwitchedOff')).toEqual(true);
  });

  it('should not add isSwitchedOff prop to Container component when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.prop('isSwitchedOff')).toEqual(false);
  });
});
