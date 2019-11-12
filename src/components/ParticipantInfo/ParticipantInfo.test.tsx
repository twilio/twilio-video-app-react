import React from 'react';
import ParticipantInfo from './ParticipantInfo';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');

const mockUsePublications = usePublications as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  it('should display MicOff icon when microphone is disabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'microphone', isTrackEnabled: false }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(true);
  });

  it('should not display MicOff icon when microphone is enabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'microphone', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(false);
  });

  it('should display ScreenShare icon when participant has published a screen share track', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'screen', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('ScreenShareIcon').exists()).toEqual(true);
  });

  it('should not display ScreenShare icon when participant has not published a screen share track', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('ScreenShareIcon').exists()).toEqual(false);
  });

  it('should add hideVideoProp to InfoContainer component when video is disabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: false }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(
      wrapper
        .find('Styled(div)')
        .at(1)
        .prop('hideVideo')
    ).toEqual(true);
  });

  it('should not add hideVideoProp to InfoContainer component when video is enabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(
      wrapper
        .find('Styled(div)')
        .at(1)
        .prop('hideVideo')
    ).toEqual(false);
  });

  it('should render a VideoCamOff icon when no camera tracks are present', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should render a VideoCamOff icon when a camera track is present and disabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: false }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should render a VideoCamOff icon when a camera tracks is present and enabled', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera', isTrackEnabled: true }]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>mock children</ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(false);
  });
});
