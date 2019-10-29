import EventEmitter from 'events';
import React from 'react';
import ParticipantStrip from './ParticipantStrip';
import { shallow } from 'enzyme';
import { useVideoContext } from '../../hooks/context';

jest.mock('../../hooks/context');
const mockedVideoContext = useVideoContext as jest.Mock<any>;

describe('the ParticipantStrip component', () => {
  it('should correctly render ParticipantInfo components', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([[0, { sid: 0 }], [1, { sid: 1 }]]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantStrip />);
    expect(wrapper).toMatchSnapshot();
  });
});
