import React from 'react';
import PrivateRoute from './PrivateRoute';
import { useAppState } from '../../state';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

const mockUseAppState = useAppState as jest.Mock<any>;

jest.mock('../../state');

const MockComponent = () => <h1>test</h1>;

describe('the PrivateRoute component', () => {
  describe('with auth enabled', () => {
    describe('when isAuthReady is true', () => {
      describe('when there is no user', () => {
        it('should redirect to /login', () => {
          process.env.REACT_APP_SET_AUTH = 'firebase';
          mockUseAppState.mockImplementation(() => ({ user: false, isAuthReady: true }));
          const wrapper = mount(
            <MemoryRouter initialEntries={['/']}>
              <PrivateRoute exact path="/">
                <MockComponent />
              </PrivateRoute>
            </MemoryRouter>
          );
          const history = wrapper.find('Router').prop('history') as any;
          expect(history.location.pathname).toEqual('/login');
          expect(history.location.search).toEqual('');
          expect(wrapper.exists(MockComponent)).toBe(false);
        });

        it('should redirect to /login and specify a redirect search parameter when a path is provided', () => {
          process.env.REACT_APP_SET_AUTH = 'firebase';
          mockUseAppState.mockImplementation(() => ({ user: false, isAuthReady: true }));
          const wrapper = mount(
            <MemoryRouter initialEntries={['/room/test-room']}>
              <PrivateRoute path="/room/:URLRoomName">
                <MockComponent />
              </PrivateRoute>
            </MemoryRouter>
          );
          const history = wrapper.find('Router').prop('history') as any;
          expect(history.location.pathname).toEqual('/login');
          expect(history.location.search).toEqual('?redirect=/room/test-room');
          expect(wrapper.exists(MockComponent)).toBe(false);
        });
      });

      it('should render children when there is a user', () => {
        process.env.REACT_APP_SET_AUTH = 'firebase';
        mockUseAppState.mockImplementation(() => ({ user: {}, isAuthReady: true }));
        const wrapper = mount(
          <MemoryRouter initialEntries={['/']}>
            <PrivateRoute exact path="/">
              <MockComponent />
            </PrivateRoute>
          </MemoryRouter>
        );
        const history = wrapper.find('Router').prop('history') as any;
        expect(history.location.pathname).toEqual('/');
        expect(wrapper.exists(MockComponent)).toBe(true);
      });
    });

    describe('when isAuthReady is false', () => {
      it('should not render children', () => {
        process.env.REACT_APP_SET_AUTH = 'firebase';
        mockUseAppState.mockImplementation(() => ({ user: false, isAuthReady: false }));
        const wrapper = mount(
          <MemoryRouter initialEntries={['/']}>
            <PrivateRoute exact path="/">
              <MockComponent />
            </PrivateRoute>
          </MemoryRouter>
        );
        const history = wrapper.find('Router').prop('history') as any;
        expect(history.location.pathname).toEqual('/');
        expect(wrapper.exists(MockComponent)).toBe(false);
      });
    });
  });

  describe('with auth disabled', () => {
    it('should render children when there is no user and isAuthReady is false', () => {
      delete process.env.REACT_APP_SET_AUTH;
      mockUseAppState.mockImplementation(() => ({ user: null, isAuthReady: false }));
      const wrapper = mount(
        <MemoryRouter initialEntries={['/']}>
          <PrivateRoute exact path="/">
            <MockComponent />
          </PrivateRoute>
        </MemoryRouter>
      );
      const history = wrapper.find('Router').prop('history') as any;
      expect(history.location.pathname).toEqual('/');
      expect(wrapper.exists(MockComponent)).toBe(true);
    });
  });
});
