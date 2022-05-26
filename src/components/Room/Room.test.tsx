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
mockUseVideoContext.mockImplementation(() => ({
  setIsBackgroundSelectionOpen: mockOpenBackgroundSelection,
}));
mockUseAppState.mockImplementation(() => ({ isGridModeActive: false }));

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

  it('should render correctly when grid mode is inactive', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({ isBackgroundSelectionOpen: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.find('MainParticipant').exists()).toBe(true);
    expect(wrapper.find('ParticipantList').exists()).toBe(true);
    expect(wrapper.find('GridView').exists()).toBe(false);
  });

  it('should render correctly when grid mode is active', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({ isBackgroundSelectionOpen: true }));
    mockUseAppState.mockImplementationOnce(() => ({ isGridModeActive: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.find('MainParticipant').exists()).toBe(false);
    expect(wrapper.find('ParticipantList').exists()).toBe(false);
    expect(wrapper.find('GridView').exists()).toBe(true);
  });
});

describe('the useSetCollaborationViewOnScreenShare hook', () => {
  const mockSetIsGridModeActive = jest.fn();
  beforeEach(jest.clearAllMocks);

  it('should not deactivate grid mode when there is no screen share participant', () => {
    renderHook(() =>
      useSetCollaborationViewOnScreenShare(undefined, { localParticipant: {} } as any, mockSetIsGridModeActive)
    );
    expect(mockSetIsGridModeActive).not.toBeCalled();
  });

  it('should deactivate grid mode when a remote participant shares their screen', () => {
    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetCollaborationViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: {} } as any,
          mockSetIsGridModeActive
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGridModeActive).not.toBeCalled();
    rerender({ screenShareParticipant: {} } as any);
    expect(mockSetIsGridModeActive).toBeCalledWith(false);
  });

  it('should not deactivate grid mode when the local participant shares their screen', () => {
    const mockLocalParticipant = {};
    const { rerender } = renderHook(
      ({ screenShareParticipant }) =>
        useSetCollaborationViewOnScreenShare(
          screenShareParticipant,
          { localParticipant: mockLocalParticipant } as any,
          mockSetIsGridModeActive
        ),
      { initialProps: { screenShareParticipant: undefined } }
    );
    expect(mockSetIsGridModeActive).not.toBeCalled();
    rerender({ screenShareParticipant: mockLocalParticipant } as any);
    expect(mockSetIsGridModeActive).not.toBeCalled();
  });
});
