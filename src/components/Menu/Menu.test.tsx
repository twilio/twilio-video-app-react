import React from 'react';
import Menu from './Menu';
import { MemoryRouter, Route } from 'react-router-dom';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useFullScreenToggle from '../../hooks/useFullScreenToggle/useFullScreenToggle';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { IVideoContext } from '../VideoProvider';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useAppState } from '../../state';

const mockedUseRoomState = useRoomState as jest.Mock<string>;
const mockeduseFullScreenToggle = useFullScreenToggle as jest.Mock;
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockToggleFullScreen = jest.fn();
const mockConnect = jest.fn();
const mockGetToken = jest.fn(() => Promise.resolve('mockToken'));

jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('../../hooks/useRoomState/useRoomState');
jest.mock('../../hooks/useFullScreenToggle/useFullScreenToggle');
jest.mock('../../state');

Object.defineProperty(window, 'location', { value: { pathname: '', configurable: true } });

const renderComponent = () => (
  <MemoryRouter>
    <Menu />
  </MemoryRouter>
);

describe('the Menu component', () => {
  beforeEach(jest.clearAllMocks);
  mockeduseFullScreenToggle.mockImplementation(() => [true, mockToggleFullScreen]);
  mockUseAppState.mockImplementation(() => ({ getToken: mockGetToken }));

  it('should hide inputs when connected to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'connected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {} } as any));
    const { container } = render(renderComponent());
    expect(container.querySelector('input')).toEqual(null);
  });

  it('should display inputs when disconnected from a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {} } as any));
    const { container } = render(renderComponent());
    expect(container.querySelectorAll('input').length).toEqual(2);
  });

  it('should display a loading spinner when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: true, room: {} } as any));
    const { container } = render(renderComponent());
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should disable the Join Room button when the Name input or Room input are empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {} } as any));
    const { getByLabelText, getByText } = render(renderComponent());
    expect(getByText('Join Room')).toBeDisabled();
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    expect(getByText('Join Room')).toBeDisabled();
    fireEvent.change(getByLabelText('Name'), { target: { value: '' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByText('Join Room')).toBeDisabled();
  });

  it('should enable the Join Room button when the Name input and Room input are not empty', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {} } as any));
    const { getByLabelText, getByText } = render(renderComponent());
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByText('Join Room')).not.toBeDisabled();
  });

  it('should disable the Join Room button when connecting to a room', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: true, room: {} } as any));
    const { getByLabelText, getByText } = render(renderComponent());
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo' } });
    expect(getByText('Join Room')).toBeDisabled();
  });

  it('should update the URL to include the room name on submit', () => {
    Object.defineProperty(window.history, 'replaceState', { value: jest.fn() });
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, connect: mockConnect, room: {} } as any));
    const { getByLabelText, getByText } = render(renderComponent());
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByText('Join Room').parentElement!);
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/room/Foo%20Test');
  });

  it('should call getToken() and connect() on submit', done => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, connect: mockConnect, room: {} } as any));
    const { getByLabelText, getByText } = render(renderComponent());
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Foo' } });
    fireEvent.change(getByLabelText('Room'), { target: { value: 'Foo Test' } });
    fireEvent.click(getByText('Join Room').parentElement!);
    expect(mockGetToken).toHaveBeenCalledWith('Foo', 'Foo Test');
    setImmediate(() => {
      expect(mockConnect).toHaveBeenCalledWith('mockToken');
      done();
    });
  });

  it('should populate the Room name from the URL', () => {
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {} } as any));
    const { getByLabelText } = render(
      <MemoryRouter initialEntries={['/room/test']}>
        <Route path="/room/:URLRoomName">
          <Menu />
        </Route>
      </MemoryRouter>
    );
    expect(getByLabelText('Room').getAttribute('value')).toEqual('test');
  });

  it('should hide the name input when a user has the displayName property and display the name instead', () => {
    mockUseAppState.mockImplementation(() => ({ user: { displayName: 'Test Name' } }));
    mockedUseRoomState.mockImplementation(() => 'disconnected');
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: true, room: {} } as any));
    const { queryByLabelText, findByText } = render(renderComponent());
    expect(queryByLabelText('Name')).toBe(null);
    expect(findByText('Test Name')).toBeTruthy();
  });
});
