import React from 'react';
import { GridView } from './GridView';
import { shallow } from 'enzyme';
import useGridLayout from '../../hooks/useGridLayout/useGridLayout';

const mockParticipants = [
  { identity: 'test-participant-1', sid: 1 },
  { identity: 'test-participant-2', sid: 2 },
  { identity: 'test-participant-3', sid: 3 },
  { identity: 'test-participant-4', sid: 4 },
];

jest.mock('../../constants', () => ({
  GRID_MODE_ASPECT_RATIO: 9 / 16,
  GRID_MODE_MAX_PARTICIPANTS: 2,
  GRID_MODE_MARGIN: 3,
}));
jest.mock('../../hooks/useParticipants/useParticipants', () => () => mockParticipants);
jest.mock('../../hooks/useVideoContext/useVideoContext', () => () => ({
  room: {
    localParticipant: { identity: 'test-local-participant' },
  },
}));
jest.mock('../../hooks/useGridLayout/useGridLayout', () =>
  jest.fn(() => ({
    participantVideoWidth: 720,
    containerRef: { current: null },
  }))
);

describe('the GridView component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<GridView />);
    expect(wrapper).toMatchSnapshot();
    expect(useGridLayout).toHaveBeenCalledWith(2);
  });
});
