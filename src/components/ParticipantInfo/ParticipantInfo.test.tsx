import React from 'react';
import ParticipantInfo from './ParticipantInfo';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';

jest.mock(
  '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel',
  () => () => 4
);

jest.mock('../../hooks/usePublications/usePublications');
const mockUsePublications = usePublications as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  it('should render correctly', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should display MicOff icon when microphone is disabled', () => {
    mockUsePublications.mockImplementation(() => [
      { trackName: 'microphone', isTrackEnabled: false },
    ]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(true);
  });

  it('should not display MicOff icon when microphone is enabled', () => {
    mockUsePublications.mockImplementation(() => [
      { trackName: 'microphone', isTrackEnabled: true },
    ]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').exists()).toEqual(false);
  });

  it('should add hideVideoProp to InfoContainer component when video is disabled', () => {
    mockUsePublications.mockImplementation(() => [
      { trackName: 'camera', isTrackEnabled: false },
    ]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(
      wrapper
        .find('Styled(div)')
        .at(1)
        .prop('hideVideo')
    ).toEqual(true);
  });

  it('should not add hideVideoProp to InfoContainer component when video is enabled', () => {
    mockUsePublications.mockImplementation(() => [
      { trackName: 'camera', isTrackEnabled: true },
    ]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(
      wrapper
        .find('Styled(div)')
        .at(1)
        .prop('hideVideo')
    ).toEqual(false);
  });
});
