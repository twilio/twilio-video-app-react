import EventEmitter from 'events';
import React from 'react';
import ParticipantList from './ParticipantList';
import { shallow } from 'enzyme';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('../VideoProvider/useSelectedParticipant/useSelectedParticipant');
jest.mock('../../hooks/useMainParticipant/useMainParticipant');
jest.mock('../../hooks/useScreenShareParticipant/useScreenShareParticipant');
const mockedVideoContext = useVideoContext as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;
const mockUseMainParticipant = useMainParticipant as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;

describe('the ParticipantList component', () => {
  let mockRoom: any;

  beforeEach(() => {
    mockUseSelectedParticipant.mockImplementation(() => [null, () => {}]);
    mockRoom = new EventEmitter();
    mockRoom.localParticipant = 'localParticipant';
  });

  it('should correctly render Participant components', () => {
    const mockParticipant = { sid: 2 };
    mockUseSelectedParticipant.mockImplementation(() => [mockParticipant, () => {}]);
    mockRoom.participants = new Map([
      [0, { sid: 0 }],
      [1, { sid: 1 }],
      [2, mockParticipant],
    ]);

    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantList />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should add the isSelected prop to the first remote participant when it is selected', () => {
    const mockParticipant = { sid: 0 };
    mockUseSelectedParticipant.mockImplementation(() => [mockParticipant, () => {}]);
    mockRoom.participants = new Map([
      [0, mockParticipant],
      [1, { sid: 1 }],
    ]);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantList />);
    expect(
      wrapper
        .find('Participant')
        .at(1)
        .prop('isSelected')
    ).toBe(true);
  });

  it('should not render anything when there are no remote particiants', () => {
    mockRoom.participants = new Map([]);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantList />);
    expect(wrapper.getElement()).toBe(null);
  });

  it('should add the hideParticipant prop when the participant is the mainParticipant', () => {
    const mockParticipant = { sid: 0 };
    mockRoom.participants = new Map([
      [0, mockParticipant],
      [1, { sid: 1 }],
    ]);
    mockUseMainParticipant.mockImplementation(() => mockParticipant);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantList />);
    expect(
      wrapper
        .find('Participant')
        .at(1)
        .prop('hideParticipant')
    ).toBe(true);

    expect(
      wrapper
        .find('Participant')
        .at(2)
        .prop('hideParticipant')
    ).toBe(false);
  });

  it('should not add the hideParticipant prop when the participant is the mainParticipant and they are selected', () => {
    const mockParticipant = { sid: 0 };
    mockRoom.participants = new Map([
      [0, mockParticipant],
      [1, { sid: 1 }],
    ]);
    mockUseMainParticipant.mockImplementation(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementation(() => [mockParticipant, () => {}]);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantList />);
    expect(
      wrapper
        .find('Participant')
        .at(1)
        .prop('hideParticipant')
    ).toBe(false);
  });

  it('should not add the hideParticipant prop when the participant is the mainParticipant and they are sharing their screen', () => {
    const mockParticipant = { sid: 0 };
    mockRoom.participants = new Map([
      [0, mockParticipant],
      [1, { sid: 1 }],
    ]);
    mockUseMainParticipant.mockImplementation(() => mockParticipant);
    mockUseScreenShareParticipant.mockImplementation(() => mockParticipant);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantList />);
    expect(
      wrapper
        .find('Participant')
        .at(1)
        .prop('hideParticipant')
    ).toBe(false);
  });
});
