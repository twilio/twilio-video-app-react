import { MobileGridView } from './MobileGridView';
import { shallow } from 'enzyme';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const mockLocalParticipant = { identity: 'test-local-participant', sid: 0 };
const mockParticipants = [{}];

jest.mock('swiper/react/swiper-react.js', () => ({
  Swiper: jest.fn(),
  SwiperSlide: jest.fn(),
}));

jest.mock('swiper', () => ({
  Pagination: jest.fn(),
}));

jest.mock('../../hooks/useCollaborationParticipants/useCollaborationParticipants');
jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('../../state');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseAppState = useAppState as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ maxGridParticipants: 9 }));

mockUseVideoContext.mockImplementation(() => ({
  room: {
    localParticipant: mockLocalParticipant,
    participants: mockParticipants,
  },
}));

describe('the MobileGridView component', () => {
  it('should render correctly when there is only the localParticipant', () => {
    const wrapper = shallow(<MobileGridView />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when there is one participant plus the localParticipant', () => {
    mockUseVideoContext.mockImplementation(() => ({
      room: {
        localParticipant: mockLocalParticipant,
        participants: [{ identity: 'test-participant-1', sid: 1 }],
      },
    }));
    const wrapper = shallow(<MobileGridView />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when there are two participants plus the localParticipant', () => {
    mockUseVideoContext.mockImplementation(() => ({
      room: {
        localParticipant: mockLocalParticipant,
        participants: [
          { identity: 'test-participant-1', sid: 1 },
          { identity: 'test-participant-2', sid: 2 },
        ],
      },
    }));
    const wrapper = shallow(<MobileGridView />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when there are 3 or more participants plus the localParticipant', () => {
    mockUseVideoContext.mockImplementation(() => ({
      room: {
        localParticipant: mockLocalParticipant,
        participants: [
          { identity: 'test-participant-1', sid: 1 },
          { identity: 'test-participant-2', sid: 2 },
          { identity: 'test-participant-3', sid: 3 },
          { identity: 'test-participant-4', sid: 4 },
        ],
      },
    }));
    const wrapper = shallow(<MobileGridView />);
    expect(wrapper).toMatchSnapshot();
  });
});
