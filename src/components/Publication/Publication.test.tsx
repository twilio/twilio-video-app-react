import React from 'react';
import Publication from './Publication';
import { shallow } from 'enzyme';
import useTrack from '../../hooks/useTrack/useTrack';

jest.mock('../../hooks/useTrack/useTrack');
const mockUseTrack = useTrack as jest.Mock<any>;

describe('the Publication component', () => {
  it('should render a VideoTrack when the track has name "camera"', () => {
    mockUseTrack.mockImplementation(() => ({ name: 'camera' }));
    const wrapper = shallow(
      <Publication
        isLocal
        publication={'mockPublication' as any}
        participant={'mockParticipant' as any}
      />
    );
    expect(useTrack).toHaveBeenCalledWith('mockPublication');
    expect(wrapper.find('VideoTrack').length).toBe(1);
  });

  it('should render an AudioTrack when the track has name "microphone"', () => {
    mockUseTrack.mockImplementation(() => ({ name: 'microphone' }));
    const wrapper = shallow(
      <Publication
        isLocal
        publication={'mockPublication' as any}
        participant={'mockParticipant' as any}
      />
    );
    expect(useTrack).toHaveBeenCalledWith('mockPublication');
    expect(wrapper.find('AudioTrack').length).toBe(1);
  });

  it('should render null when there is no track', () => {
    mockUseTrack.mockImplementation(() => null);
    const wrapper = shallow(
      <Publication
        isLocal
        publication={'mockPublication' as any}
        participant={'mockParticipant' as any}
      />
    );
    expect(useTrack).toHaveBeenCalledWith('mockPublication');
    expect(wrapper.find('*').length).toBe(0);
  });
});
