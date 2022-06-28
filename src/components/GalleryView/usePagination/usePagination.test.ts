import { renderHook, act } from '@testing-library/react-hooks';
import { useAppState } from '../../../state';
import { usePagination } from './usePagination';

jest.mock('../../../state');

const mockUseAppState = useAppState as jest.Mock<any>;

describe('the usePagination hook', () => {
  beforeEach(() => {
    mockUseAppState.mockImplementation(() => ({ maxGalleryViewParticipants: 3 }));
  });

  it('should function correctly', () => {
    const { result } = renderHook(() => usePagination([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as any[]));
    expect(result.current.paginatedParticipants).toEqual([1, 2, 3]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(4);

    act(() => {
      result.current.setCurrentPage(2);
    });
    expect(result.current.paginatedParticipants).toEqual([4, 5, 6]);
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setCurrentPage(3);
    });
    expect(result.current.paginatedParticipants).toEqual([7, 8, 9]);
    expect(result.current.currentPage).toBe(3);

    act(() => {
      result.current.setCurrentPage(4);
    });
    expect(result.current.paginatedParticipants).toEqual([10]);
    expect(result.current.currentPage).toBe(4);
  });

  it('should correctly respond to participants leaving the room when the user is on the last page', () => {
    const { result, rerender } = renderHook(props => usePagination(props.participants as any[]), {
      initialProps: { participants: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    });

    act(() => {
      result.current.setCurrentPage(4);
    });

    expect(result.current.paginatedParticipants).toEqual([10]);
    expect(result.current.totalPages).toBe(4);

    rerender({ participants: [1, 2, 3, 4, 5] });

    expect(result.current.paginatedParticipants).toEqual([4, 5]);
    expect(result.current.totalPages).toBe(2);

    rerender({ participants: [1, 2, 3] });

    expect(result.current.paginatedParticipants).toEqual([1, 2, 3]);
    expect(result.current.totalPages).toBe(1);
  });

  it('should correctly respond to the maxGalleryViewParticipants value being changed', () => {
    const { result, rerender } = renderHook(() => usePagination([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as any[]));
    expect(result.current.paginatedParticipants).toEqual([1, 2, 3]);
    expect(result.current.totalPages).toBe(4);

    mockUseAppState.mockImplementation(() => ({ maxGalleryViewParticipants: 2 }));
    rerender();

    expect(result.current.paginatedParticipants).toEqual([1, 2]);
    expect(result.current.totalPages).toBe(5);
  });

  it('should correctly respond to the maxGalleryViewParticipants value being reduced when the user is on the last page', () => {
    const { result, rerender } = renderHook(() => usePagination([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as any[]));

    act(() => {
      result.current.setCurrentPage(4);
    });

    expect(result.current.paginatedParticipants).toEqual([10]);
    expect(result.current.totalPages).toBe(4);

    mockUseAppState.mockImplementation(() => ({ maxGalleryViewParticipants: 2 }));
    rerender();

    expect(result.current.paginatedParticipants).toEqual([7, 8]);
    expect(result.current.totalPages).toBe(5);
  });

  it('should correctly respond to the maxGalleryViewParticipants value being increased when the user is on the last page', () => {
    const { result, rerender } = renderHook(() => usePagination([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as any[]));

    act(() => {
      result.current.setCurrentPage(3);
    });

    expect(result.current.paginatedParticipants).toEqual([7, 8, 9]);
    expect(result.current.totalPages).toBe(4);

    mockUseAppState.mockImplementation(() => ({ maxGalleryViewParticipants: 4 }));
    rerender();

    expect(result.current.paginatedParticipants).toEqual([9, 10]);
    expect(result.current.totalPages).toBe(3);
  });
});
