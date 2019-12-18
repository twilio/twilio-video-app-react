import React from 'react';
import Menu, { getRoomName } from './Menu';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useFullScreenToggler from '../../hooks/useFullScreenToggler/useFullScreenToggler';
import { IVideoContext, useVideoContext } from '../../hooks/context';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseFullScreenToggler = useFullScreenToggler as jest.Mock;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockToggleFullScreen = jest.fn();
const mockGetToken = jest.fn();

jest.mock('../../hooks/context');
jest.mock('../../hooks/useRoomState/useRoomState');
jest.mock('../../hooks/useFullScreenToggler/useFullScreenToggler');
jest.mock('../../state', () => ({ useAppState: () => ({ getToken: mockGetToken }) }));

Object.defineProperty(window, 'location', { value: { pathname: '', configurable: true } });

describe('the Menu component', () => {
  mockedUseFullScreenToggler.mockImplementation(() => [true, mockToggleFullScreen]);

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
    const { getByLabelText, getByText } = render(<Menu />);
    expect(getByText('Join Room')).toBeDisabled();
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    expect(getByText('Join Room')).toBeDisabled();
    fireEvent.change(getByLabelText('Name'), { target: { value: '' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByText('Join Room')).toBeDisabled();
  });

  it('should enable the Join Room button when the Name input and Room input are not empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { getByLabelText, getByText } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByText('Join Room')).not.toBeDisabled();
  });

  it('should disable the Join Room button when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: true } as any));
    const { getByLabelText, getByText } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByText('Join Room')).toBeDisabled();
  });

  it('should update the URL to include the room name on submit', () => {
    Object.defineProperty(window.history, 'replaceState', { value: jest.fn() });
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { getByLabelText, getByText } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByText('Join Room').parentElement!);
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/room/Foo%20Test');
  });

  it('should call getToken on submit', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { getByLabelText, getByText } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByText('Join Room').parentElement!);
    expect(mockGetToken).toHaveBeenCalledWith('Foo', 'Foo Test');
  });

  it('should populate the Room name from the URL', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    window.location.pathname = '/room/test';
    const { getByLabelText } = render(<Menu />);
    expect(getByLabelText('Room').getAttribute('value')).toEqual('test');
  });

  describe('the getRoom function', () => {
    it('should extract the room name from the URL', () => {
      window.location.pathname = '/room/test';
      expect(getRoomName()).toEqual('test');
      window.location.pathname = '/room/test/';
      expect(getRoomName()).toEqual('test');
      window.location.pathname = '/room/test%20test';
      expect(getRoomName()).toEqual('test test');
    });

    it('should return an empty string when there is no room name', () => {
      window.location.pathname = '/';
      expect(getRoomName()).toEqual('');
      window.location.pathname = '/invalid/room/test';
      expect(getRoomName()).toEqual('');
    });
  });
});
