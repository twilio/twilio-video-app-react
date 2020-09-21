import React from 'react';
import MainParticipant from './MainParticipant';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { shallow } from 'enzyme';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/useMainSpeaker/useMainSpeaker');
jest.mock('../VideoProvider/useSelectedParticipant/useSelectedParticipant');
jest.mock('../../hooks/useScreenShareParticipant/useScreenShareParticipant');
jest.mock('../../hooks/useVideoContext/useVideoContext');

const mockUseMainSpeaker = useMainSpeaker as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

const mockLocalParticipant = {};

describe('the MainParticipant component', () => {
  mockUseVideoContext.mockImplementation(() => ({
    room: {
      localParticipant: mockLocalParticipant,
    },
  }));

  it('should set the videoPriority to high when the main participant is the selected participant', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [mockParticipant]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe('high');
  });

  it('should set the videoPriority to high when the main participant is sharing their screen', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [{}]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => mockParticipant);
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe('high');
  });

  describe('when the main participant is the localParticipant', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementation(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementation(() => [{}]);
    mockUseScreenShareParticipant.mockImplementation(() => mockParticipant);
    mockUseVideoContext.mockImplementation(() => ({
      room: {
        localParticipant: mockParticipant,
      },
    }));

    const wrapper = shallow(<MainParticipant />);

    it('should not set the videoPriority', () => {
      expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe(null);
    });

    it('should set the enableScreenShare prop to false', () => {
      expect(wrapper.find(ParticipantTracks).prop('enableScreenShare')).toBe(false);
    });
  });

  it('should set the videoPriority to null when the main participant is not the selected participant and they are not sharing their screen', () => {
    const mockParticipant = {};
    mockUseMainSpeaker.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [{}]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe(null);
  });
});
