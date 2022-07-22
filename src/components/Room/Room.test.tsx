import React from 'react';
import { shallow } from 'enzyme';
import { renderHook } from '@testing-library/react-hooks';

import Room, { useSetSpeakerViewOnScreenShare } from './Room';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';

jest.mock('swiper/react', () => ({
  Swiper: jest.fn(),
  SwiperSlide: jest.fn(),
}));

jest.mock('swiper', () => ({
  Pagination: jest.fn(),
}));

jest.mock('../../hooks/useChatContext/useChatContext');
jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('../../state');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseChatContext = useChatContext as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

const mockToggleChatWindow = jest.fn();
const mockOpenBackgroundSelection = jest.fn();
mockUseChatContext.mockImplementation(() => ({ setIsChatWindowOpen: mockToggleChatWindow }));
mockUseVideoContext.mockImplementation(() => ({ setIsBackgroundSelectionOpen: mockOpenBackgroundSelection }));
mockUseAppState.mockImplementation(() => ({ isGalleryViewActive: false }));

describe('the Room component', () => {
  it('should render correctly when the chat window and background selection windows are closed', () => {
    const wrapper = shallow(<Room />);
    expect(wrapper.prop('className')).not.toContain('rightDrawerOpen');
  });

  it('should render correctly with chat window open', () => {
    mockUseChatContext.mockImplementationOnce(() => ({ isChatWindowOpen: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.prop('className')).toContain('rightDrawerOpen');
  });

  it('should render correctly with the background selection window open', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({ isBackgroundSelectionOpen: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.prop('className')).toContain('rightDrawerOpen');
  });

  it('should render correctly when gallery view is inactive', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({ isBackgroundSelectionOpen: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.find('MainParticipant').exists()).toBe(true);
    expect(wrapper.find('ParticipantList').exists()).toBe(true);
    expect(wrapper.find('GalleryView').exists()).toBe(false);
  });

  it('should render correctly when gallery view is active', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({ isBackgroundSelectionOpen: true }));
    mockUseAppState.mockImplementationOnce(() => ({ isGalleryViewActive: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.find('MainParticipant').exists()).toBe(false);
    expect(wrapper.find('ParticipantList').exists()).toBe(false);
    expect(wrapper.find('GalleryView').exists()).toBe(true);
  });
});

describe('the useSetSpeakerViewOnScreenShare hook', () => {
  const mockSetIsGalleryViewActive = jest.fn();
  beforeEach(jest.clearAllMocks);

  it('should not deactivate gallery view when there is no screen share participant', () => {
    renderHook(() =>
      useSetSpeakerViewOnScreenShare(undefined, { localParticipant: {} } as any, mockSetIsGalleryViewActive, true)
    );
    expect(mockSetIsGalleryViewActive).not.toBeCalled();
  });

  it('should deactivate gallery view when a remote participant shares their screen', () => {
    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetSpeakerViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: {} } as any,
          mockSetIsGalleryViewActive,
          true
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGalleryViewActive).not.toBeCalled();
    rerender({ screenShareParticipant: {} } as any);
    expect(mockSetIsGalleryViewActive).toBeCalledWith(false);
  });

  it('should reactivate gallery view when screenshare ends if gallery view was active before another participant started screensharing', () => {
    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetSpeakerViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: {} } as any,
          mockSetIsGalleryViewActive,
          true
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGalleryViewActive).not.toBeCalled();
    // screenshare starts
    rerender({ screenShareParticipant: {} } as any);
    expect(mockSetIsGalleryViewActive).toBeCalledWith(false);
    // screenshare ends
    rerender({ screenShareParticipant: undefined } as any);
    expect(mockSetIsGalleryViewActive).toBeCalledWith(true);
  });

  it('should not activate gallery view when screenshare ends if speaker view was active before another participant started screensharing', () => {
    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetSpeakerViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: {} } as any,
          mockSetIsGalleryViewActive,
          false
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGalleryViewActive).not.toBeCalled();
    // screenshare starts
    rerender({ screenShareParticipant: {} } as any);
    expect(mockSetIsGalleryViewActive).toBeCalledWith(false);
    // screenshare ends
    rerender({ screenShareParticipant: undefined } as any);
    // mockSetIsGalleryViewActive should only be called once with "false" since we're not reactivating gallery mode
    expect(mockSetIsGalleryViewActive).toBeCalledTimes(1);
  });

  it('should not activate speaker view when screenshare ends if it was active before screensharing, but the user switched to gallery view during the screenshare', () => {
    const mockScreenShareParticipant = {};
    const mockRoom = { localParticipant: {} } as any;

    const { rerender } = renderHook(
      ({ screenShareParticipant, isGalleryViewActive }) =>
        useSetSpeakerViewOnScreenShare(
          screenShareParticipant,
          mockRoom,
          mockSetIsGalleryViewActive,
          isGalleryViewActive
        ),
      { initialProps: { screenShareParticipant: undefined, isGalleryViewActive: false } }
    );

    expect(mockSetIsGalleryViewActive).not.toBeCalled();

    // start screenshare
    rerender({ screenShareParticipant: mockScreenShareParticipant, isGalleryViewActive: false } as any);
    expect(mockSetIsGalleryViewActive).toBeCalledWith(false);

    // enable gallery view
    rerender({ screenShareParticipant: mockScreenShareParticipant, isGalleryViewActive: true } as any);

    // stop screenshare
    rerender({ screenShareParticipant: undefined, isGalleryViewActive: true } as any);

    // mockSetIsGalleryViewActive should only be called once with "false" since we're not reactivating gallery view
    expect(mockSetIsGalleryViewActive).toBeCalledTimes(1);
  });

  it('should not deactivate gallery view when the local participant shares their screen', () => {
    const mockLocalParticipant = {};
    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetSpeakerViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: mockLocalParticipant } as any,
          mockSetIsGalleryViewActive,
          true
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGalleryViewActive).not.toBeCalled();
    rerender({ screenShareParticipant: mockLocalParticipant } as any);
    expect(mockSetIsGalleryViewActive).not.toBeCalled();
  });
});
