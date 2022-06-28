import React from 'react';
import { GalleryView } from './GalleryView';
import { shallow } from 'enzyme';
import useGalleryViewLayout from '../../hooks/useGalleryViewLayout/useGalleryViewLayout';
import { useAppState } from '../../state';
import { usePagination } from './usePagination/usePagination';

const mockLocalParticipant = { identity: 'test-local-participant', sid: 0 };
const mockParticipants = [
  { identity: 'test-participant-1', sid: 1 },
  { identity: 'test-participant-2', sid: 2 },
  { identity: 'test-participant-3', sid: 3 },
  { identity: 'test-participant-4', sid: 4 },
];

jest.mock('../../constants', () => ({
  GALLERY_VIEW_ASPECT_RATIO: 9 / 16,
  GALLERY_VIEW_MARGIN: 3,
}));
jest.mock('../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants', () => () => mockParticipants);
jest.mock('../../hooks/useVideoContext/useVideoContext', () => () => ({
  room: {
    localParticipant: mockLocalParticipant,
  },
}));

jest.mock('../../hooks/useParticipantsContext/useParticipantsContext', () => () => ({
  galleryViewParticipants: mockParticipants,
}));

jest.mock('../../hooks/useGalleryViewLayout/useGalleryViewLayout', () =>
  jest.fn(() => ({
    participantVideoWidth: 720,
    containerRef: { current: null },
  }))
);

jest.mock('./usePagination/usePagination', () => ({
  usePagination: jest.fn(() => ({
    currentPage: 2,
    totalPages: 4,
    setCurrentPage: jest.fn(),
    paginatedParticipants: [mockLocalParticipant, ...mockParticipants],
  })),
}));

jest.mock('../../state');

const mockUsePagination = usePagination as jest.Mock<any>;
const mockUseAppState = useAppState as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ maxGalleryViewParticipants: 9 }));

describe('the GalleryView component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<GalleryView />);
    expect(wrapper).toMatchSnapshot();
    expect(useGalleryViewLayout).toHaveBeenCalledWith(9);
  });

  it('should not render the previous page button when the user is viewing the first page', () => {
    mockUsePagination.mockImplementationOnce(() => ({
      currentPage: 1,
      totalPages: 4,
      setCurrentPage: jest.fn(),
      paginatedParticipants: [mockLocalParticipant, ...mockParticipants],
    }));

    const wrapper = shallow(<GalleryView />);
    expect(
      wrapper
        .find('.makeStyles-buttonContainerLeft-4')
        .childAt(0)
        .exists()
    ).toBe(false);
    expect(
      wrapper
        .find('.makeStyles-buttonContainerRight-5')
        .childAt(0)
        .exists()
    ).toBe(true);
  });

  it('should not render the next page button when the user is viewing the last page', () => {
    mockUsePagination.mockImplementationOnce(() => ({
      currentPage: 4,
      totalPages: 4,
      setCurrentPage: jest.fn(),
      paginatedParticipants: [mockLocalParticipant, ...mockParticipants],
    }));

    const wrapper = shallow(<GalleryView />);
    expect(
      wrapper
        .find('.makeStyles-buttonContainerLeft-4')
        .childAt(0)
        .exists()
    ).toBe(true);
    expect(
      wrapper
        .find('.makeStyles-buttonContainerRight-5')
        .childAt(0)
        .exists()
    ).toBe(false);
  });

  it('should not render the Pagination component when there is only one page', () => {
    mockUsePagination.mockImplementationOnce(() => ({
      currentPage: 1,
      totalPages: 1,
      setCurrentPage: jest.fn(),
      paginatedParticipants: [mockLocalParticipant, ...mockParticipants],
    }));

    const wrapper = shallow(<GalleryView />);
    expect(wrapper.find('.makeStyles-pagination-8').exists()).toBe(false);
  });
});
