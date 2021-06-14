import React from 'react';
import { shallow } from 'enzyme';

import Room from './Room';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
jest.mock('../../hooks/useChatContext/useChatContext');
jest.mock('../../hooks/useVideoContext/useVideoContext');

const mockUseChatContext = useChatContext as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

const mockToggleChatWindow = jest.fn();
const mockOpenBackgroundSelection = jest.fn();
mockUseChatContext.mockImplementation(() => ({ setIsChatWindowOpen: mockToggleChatWindow }));
mockUseVideoContext.mockImplementation(() => ({ setBackgroundSelectionOpen: mockOpenBackgroundSelection }));

describe('the Room component', () => {
  it('should render correctly with chat window closed', () => {
    const wrapper = shallow(<Room />);
    expect(wrapper.prop('className')).not.toContain('chatWindowOpen');
  });

  it('should render correctly with chat window open', () => {
    mockUseChatContext.mockImplementationOnce(() => ({ isChatWindowOpen: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.prop('className')).toContain('chatWindowOpen');
  });

  it('should render correctly with the background selection window closed', () => {
    const wrapper = shallow(<Room />);
    expect(wrapper.prop('className')).not.toContain('backgroundSelectionOpen');
  });

  it('should render correctly with the background selection window open', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({ backgroundSelectionOpen: true }));
    const wrapper = shallow(<Room />);
    expect(wrapper.prop('className')).toContain('backgroundSelectionOpen');
  });
});
