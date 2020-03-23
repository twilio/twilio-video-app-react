import React from 'react';
import MainParticipant from './MainParticipant';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { shallow } from 'enzyme';

import useDominantSpeaker from '../../hooks/useDominantSpeaker/useDominantSpeaker';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';

jest.mock('../../hooks/useDominantSpeaker/useDominantSpeaker');
jest.mock('../../hooks/useMainSpeaker/useMainSpeaker');
jest.mock('../../hooks/useScreenShareParticipant/useScreenShareParticipant');

const mockUseDominantSpeaker = useDominantSpeaker as jest.Mock<any>;
const mockUseMainSpeaker = useMainSpeaker as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;

describe('the MainParticipant component', () => {
  it('should set the videoPriority to high when the main participant is not the dominant speaker or sharing their screen', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseDominantSpeaker.mockImplementationOnce(() => ({}));
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe('high');
  });

  it('should set the videoPriority to null when the main participant is the dominant speaker', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseDominantSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe(null);
  });

  it('should set the videoPriority to null when the main participant is sharing their screen', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseDominantSpeaker.mockImplementationOnce(() => ({}));
    mockUseScreenShareParticipant.mockImplementationOnce(() => mockParticipant);
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe(null);
  });
});
