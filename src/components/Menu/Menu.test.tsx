import React from 'react';
import Menu from './Menu';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import { IVideoContext, useVideoContext } from '../../hooks/context';
import { fireEvent, render } from '@testing-library/react';

jest.mock('../../hooks/context');
jest.mock('../../hooks/useRoomState/useRoomState');
jest.mock('../../store/main/main');
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;

describe('the Menu component', () => {
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
    const { getByLabelText, getByRole } = render(<Menu />);
    expect(getByRole('button').getAttribute('disabled')).toEqual('');
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    expect(getByRole('button').getAttribute('disabled')).toEqual('');
    fireEvent.change(getByLabelText('Name'), { target: { value: '' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByRole('button').getAttribute('disabled')).toEqual('');
  });

  it('should enable the Join Room button when the Name input and Room input are not empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false } as any));
    const { getByLabelText, getByRole } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByRole('button').getAttribute('disabled')).toEqual(null);
  });

  it('should disable the Join Room button when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: true } as any));
    const { getByLabelText, getByRole } = render(<Menu />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByRole('button').getAttribute('disabled')).toEqual('');
  });
});
