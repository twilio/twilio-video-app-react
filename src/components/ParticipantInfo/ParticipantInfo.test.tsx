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

  it('should not display MicOff icon when microphone is enabled', () => {
    mockUsePublications.mockImplementation(() => [
      { trackName: 'microphone', isTrackEnabled: true },
    ]);
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('MicOffIcon').length).toEqual(0);
  });
});
