import React from 'react';
import App from './App';
import MenuBar from './components/MenuBar/MenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import Room from './components/Room/Room';
import { shallow } from 'enzyme';
import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';

jest.mock('swiper/react', () => ({
  Swiper: jest.fn(),
  SwiperSlide: jest.fn(),
}));

jest.mock('swiper', () => ({
  Pagination: jest.fn(),
}));

jest.mock('./hooks/useRoomState/useRoomState');
jest.mock('./hooks/useHeight/useHeight');

const mockUseRoomState = useRoomState as jest.Mock<any>;
const mockUseHeight = useHeight as jest.Mock<any>;

mockUseHeight.mockImplementation(() => '500px');

describe('the App component', () => {
  it('should render correctly when disconnected from a room', () => {
    mockUseRoomState.mockImplementation(() => 'disconnected');
    const wrapper = shallow(<App />);

    expect(wrapper.find(PreJoinScreens).exists()).toBe(true);
    expect(wrapper.find(Room).exists()).toBe(false);
    expect(wrapper.find(MenuBar).exists()).toBe(false);
  });

  it('should render correctly when connected (or reconnecting) to a room', () => {
    mockUseRoomState.mockImplementation(() => 'connected');
    const wrapper = shallow(<App />);

    expect(wrapper.find(PreJoinScreens).exists()).toBe(false);
    expect(wrapper.find(Room).exists()).toBe(true);
    expect(wrapper.find(MenuBar).exists()).toBe(true);
  });

  it('should set the height of the main container using the useHeight hook', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.prop('style')).toEqual({ height: '500px' });
  });
});
