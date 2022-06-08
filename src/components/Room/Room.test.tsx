import React from 'react';
import { shallow } from 'enzyme';
import { renderHook } from '@testing-library/react-hooks';

import Room, { useSetCollaborationViewOnScreenShare } from './Room';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';

jest.mock('swiper/react/swiper-react.js', () => ({
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
mockUseAppState.mockImplementation(() => ({ isGridViewActive: false }));

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

  it('should render correctly when grid view is inactive', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({ isBackgroundSelectionOpen: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.find('MainParticipant').exists()).toBe(true);
    expect(wrapper.find('ParticipantList').exists()).toBe(true);
    expect(wrapper.find('GridView').exists()).toBe(false);
  });

  it('should render correctly when grid view is active', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({ isBackgroundSelectionOpen: true }));
    mockUseAppState.mockImplementationOnce(() => ({ isGridViewActive: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.find('MainParticipant').exists()).toBe(false);
    expect(wrapper.find('ParticipantList').exists()).toBe(false);
    expect(wrapper.find('GridView').exists()).toBe(true);
  });
});

describe('the useSetCollaborationViewOnScreenShare hook', () => {
  const mockSetIsGridViewActive = jest.fn();
  beforeEach(jest.clearAllMocks);

  it('should not deactivate grid view when there is no screen share participant', () => {
    renderHook(() =>
      useSetCollaborationViewOnScreenShare(undefined, { localParticipant: {} } as any, mockSetIsGridViewActive, true)
    );
    expect(mockSetIsGridViewActive).not.toBeCalled();
  });

  it('should deactivate grid view when a remote participant shares their screen', () => {
    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetCollaborationViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: {} } as any,
          mockSetIsGridViewActive,
          true
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGridViewActive).not.toBeCalled();
    rerender({ screenShareParticipant: {} } as any);
    expect(mockSetIsGridViewActive).toBeCalledWith(false);
  });

  it('should reactivate grid view when screenshare ends if grid view was active before another participant started screensharing', () => {
    jest.spyOn(React, 'useRef').mockReturnValue({
      current: true,
    });

    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetCollaborationViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: {} } as any,
          mockSetIsGridViewActive,
          true
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGridViewActive).not.toBeCalled();
    // screenshare starts
    rerender({ screenShareParticipant: {} } as any);
    expect(mockSetIsGridViewActive).toBeCalledWith(false);
    // screenshare ends
    rerender({ screenShareParticipant: {} } as any);
    expect(mockSetIsGridViewActive).toBeCalledWith(true);
  });

  it('should not reactivate grid view when screenshare ends if grid view was active before another participant started screensharing', () => {
    jest.spyOn(React, 'useRef').mockReturnValue({
      current: false,
    });

    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetCollaborationViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: {} } as any,
          mockSetIsGridViewActive,
          true
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGridViewActive).not.toBeCalled();
    rerender({ screenShareParticipant: {} } as any);
    expect(mockSetIsGridViewActive).toBeCalledWith(false);
    // mockSetIsGridViewActive should only be called once with "false" since we're not reactivating grid mode
    expect(mockSetIsGridViewActive).toBeCalledTimes(1);
  });

  it('should not deactivate grid view when the local participant shares their screen', () => {
    const mockLocalParticipant = {};
    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetCollaborationViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: mockLocalParticipant } as any,
          mockSetIsGridViewActive,
          true
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGridViewActive).not.toBeCalled();
    rerender({ screenShareParticipant: mockLocalParticipant } as any);
    expect(mockSetIsGridViewActive).not.toBeCalled();
  });
});
