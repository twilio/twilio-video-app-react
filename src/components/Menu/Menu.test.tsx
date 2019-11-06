import React from 'react';
import Menu from './Menu';
import { getToken, receiveToken } from '../../store/main/main';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useFullScreenToggler from '../../hooks/useFullScreenToggler/useFullScreenToggler';
import { IVideoContext, useVideoContext } from '../../hooks/context';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../hooks/context');
jest.mock('../../hooks/useRoomState/useRoomState');
jest.mock('../../hooks/useFullScreenToggler/useFullScreenToggler');
jest.mock('../../store/main/main');
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseFullScreenToggler = useFullScreenToggler as jest.Mock;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const toggleFullScreen = jest.fn();

describe('the Menu component', () => {
  mockedUseFullScreenToggler.mockImplementation(() => [true, toggleFullScreen]);

  it('should hide inputs when connected to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'connected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { container } = render(<Menu />);
    expect(container.querySelector('input')).toEqual(null);
  });

  it('should display inputs when disconnected from a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { container } = render(<Menu />);
    expect(container.querySelectorAll('input').length).toEqual(2);
  });

  it('should display a loading spinner when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: true } as any));
    const { container } = render(<Menu />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should disable the Join Room button when the Name input or Room input are empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { getByLabelText, getByTestId } = render(<Menu />);
    expect(getByTestId('join-room-button').getAttribute('disabled')).toEqual('');
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    expect(getByTestId('join-room-button').getAttribute('disabled')).toEqual('');
    fireEvent.change(getByLabelText('Name'), { target: { value: '' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-room-button').getAttribute('disabled')).toEqual('');
  });

  it('should enable the Join Room button when the Name input and Room input are not empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { getByLabelText, getByTestId } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-room-button').getAttribute('disabled')).toEqual(null);
  });

  it('should disable the Join Room button when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: true } as any));
    const { getByLabelText, getByTestId } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByTestId('join-room-button').getAttribute('disabled')).toEqual('');
  });

  it('should dispatch a redux action when the Join Room button is clicked', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { getByLabelText, getByTestId } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Username' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Roomname' } });
    fireEvent.click(getByTestId('join-room-button'));
    expect(getToken).toHaveBeenCalledWith('Username', 'Roomname');
  });

  it('should dispatch a redux action when the Leave Room button is clicked', () => {
    mockedUseRoomState.mockImplementation(() => 'connected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { getByTestId } = render(<Menu />);
    fireEvent.click(getByTestId('leave-room-button'));
    expect(receiveToken).toHaveBeenCalledWith('');
  });

  describe('Full screen button', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));

    it('should call toggleFullScreen when Toggle FullScreen button is clicked', () => {
      const { getByTestId } = render(<Menu />);
      fireEvent.click(getByTestId('toggle-full-screen'));
      expect(toggleFullScreen).toHaveBeenCalled();
    });

    it('should render exit-full-screen-icon when the page is in full screen mode', () => {
      const { getByTestId } = render(<Menu />);
      expect(getByTestId('exit-fullscreen-icon')).toBeInTheDocument();
    });

    it('should render full-screen-icon when the page is not in full screen mode', () => {
      mockedUseFullScreenToggler.mockImplementation(() => [false, toggleFullScreen]);

      const { getByTestId } = render(<Menu />);
      expect(getByTestId('full-screen-icon')).toBeInTheDocument();
    });
  });
});
