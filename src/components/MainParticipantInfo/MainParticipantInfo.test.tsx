import React from 'react';
import MainParticipantInfo from './MainParticipantInfo';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');

const mockUsePublications = usePublications as jest.Mock<any>;

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
});
