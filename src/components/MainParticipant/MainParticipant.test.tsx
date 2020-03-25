import React from 'react';
import MainParticipant from './MainParticipant';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { shallow } from 'enzyme';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';

jest.mock('../../hooks/useMainSpeaker/useMainSpeaker');
jest.mock('../VideoProvider/useSelectedParticipant/useSelectedParticipant');

const mockUseMainSpeaker = useMainSpeaker as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;

describe('the MainParticipant component', () => {
  it('should set the videoPriority to high when the main participant is the selected participant', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [mockParticipant]);
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe('high');
  });

  it('should set the videoPriority to null when the main participant is not the selected participant', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [{}]);
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe(null);
  });
});
