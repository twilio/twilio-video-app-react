import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import usePasscodeAuth, { getPasscode, verifyPasscode } from './usePasscodeAuth';

// @ts-ignore
delete window.location;

// @ts-ignore
window.location = {
  search: '',
};

const customHistory = { ...createBrowserHistory(), replace: jest.fn() };

const wrapper = (props: React.PropsWithChildren<unknown>) => (
  <Router history={customHistory as any}>{props.children}</Router>
);

describe('the usePasscodeAuth hook', () => {
  describe('on first render', () => {
    beforeEach(() => window.sessionStorage.clear());
    it('should return a user when the passcode is valid', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
      );
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();
      expect(result.current).toMatchObject({ isAuthReady: true, user: { passcode: '123123' } });
    });

    it('should remove the query parameter from the URL when the passcode is valid', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
      );
      // @ts-ignore
      window.location = {
        search: '?passcode=000000',
        origin: 'http://test-origin',
        pathname: '/test-pathname',
      };
      Object.defineProperty(window.history, 'replaceState', { value: jest.fn() });
      window.sessionStorage.setItem('passcode', '123123');
      const { waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();
      expect(customHistory.replace).toHaveBeenLastCalledWith('/test-pathname');
    });

    it('should not return a user when the app code is invalid', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ status: 401, json: () => Promise.resolve({ type: 'errorMessage' }) })
      );
      window.location.search = '';
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();
      expect(result.current).toMatchObject({ isAuthReady: true, user: null });
    });

    it('should not return a user when there is no passcode', () => {
      const { result } = renderHook(usePasscodeAuth, { wrapper });
      expect(result.current).toMatchObject({ isAuthReady: true, user: null });
    });
  });

  describe('signout function', () => {
    it('should clear session storage and user on signout', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
      );
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();
      await act(() => result.current.signOut());
      expect(window.sessionStorage.getItem('passcode')).toBe(null);
      expect(result.current.user).toBe(null);
    });
  });

  describe('signin function', () => {
    it('should set a user when a valid passcode is submitted', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
      );
      const { result } = renderHook(usePasscodeAuth, { wrapper });
      await act(() => result.current.signIn('123456'));
      expect(result.current.user).toEqual({ passcode: '123456' });
    });

    it('should return an error when an invalid passcode is submitted', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ status: 401, json: () => Promise.resolve({ error: { message: 'passcode incorrect' } }) })
      );
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();
      result.current.signIn('123456').catch(err => {
        expect(err.message).toBe('Passcode is incorrect');
      });
    });

    it('should return an error when an expired passcode is submitted', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ status: 401, json: () => Promise.resolve({ error: { message: 'passcode expired' } }) })
      );
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();
      result.current.signIn('123456').catch(err => {
        expect(err.message).toBe('Passcode has expired');
      });
    });
  });

  describe('the getToken function', () => {
    it('should call the API with the correct parameters', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
      );
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();

      await act(async () => {
        result.current.getToken('test-name', 'test-room');
      });

      expect(window.fetch).toHaveBeenLastCalledWith('/token', {
        body:
          '{"user_identity":"test-name","room_name":"test-room","passcode":"123123","create_room":true,"create_conversation":true}',
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      });
    });

    it('should call the API with the correct parameters when REACT_APP_DISABLE_TWILIO_CONVERSATIONS is true', async () => {
      process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS = 'true';

      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
      );
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();

      await act(async () => {
        result.current.getToken('test-name', 'test-room');
      });

      expect(window.fetch).toHaveBeenLastCalledWith('/token', {
        body:
          '{"user_identity":"test-name","room_name":"test-room","passcode":"123123","create_room":true,"create_conversation":false}',
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      });

      // reset the environment variable
      delete process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS;
    });

    it('should return a token', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
      );
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();

      let token = '';
      await act(async () => {
        token = await result.current.getToken('test-name', 'test-room');
      });
      expect(token).toEqual({ token: 'mockVideoToken' });
    });

    it('should return a useful error message from the serverless function', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() =>
        // Return a successful response when the passcode is initially verified
        Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
      );
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth, { wrapper });
      await waitForNextUpdate();
      // @ts-ignore
      window.fetch = jest.fn(() =>
        // Return an error when the user tries to join a room
        Promise.resolve({ status: 401, json: () => Promise.resolve({ error: { message: 'passcode expired' } }) })
      );

      result.current.getToken('test-name', 'test-room').catch(err => {
        expect(err.message).toBe('Passcode has expired');
      });
    });
  });
});

describe('the getPasscode function', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('should return the passcode from session storage', () => {
    window.location.search = '';
    window.sessionStorage.setItem('passcode', '123123');
    expect(getPasscode()).toBe('123123');
  });

  it('should return the passcode from the URL', () => {
    window.location.search = '?passcode=234234';

    expect(getPasscode()).toBe('234234');
  });

  it('should return the passcode from the URL when the app code is also sotred in sessionstorage', () => {
    window.sessionStorage.setItem('passcode', '123123');
    window.location.search = '?passcode=234234';

    expect(getPasscode()).toBe('234234');
  });

  it('should return null when there is no passcode', () => {
    window.location.search = '';
    expect(getPasscode()).toBe(null);
  });
});

describe('the verifyPasscode function', () => {
  it('should return the correct response when the passcode is valid', async () => {
    // @ts-ignore
    window.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mockVideoToken' }) })
    );

    const result = await verifyPasscode('123456');
    expect(result).toEqual({ isValid: true });
  });

  it('should return the correct response when the passcode is invalid', async () => {
    // @ts-ignore
    window.fetch = jest.fn(() =>
      Promise.resolve({ status: 401, json: () => Promise.resolve({ error: { message: 'errorMessage' } }) })
    );

    const result = await verifyPasscode('123456');
    expect(result).toEqual({ isValid: false, error: 'errorMessage' });
  });

  it('should call the API with the correct parameters', async () => {
    await verifyPasscode('123456');
    expect(window.fetch).toHaveBeenLastCalledWith('/token', {
      body:
        '{"user_identity":"temp-name","room_name":"temp-room","passcode":"123456","create_room":false,"create_conversation":false}',
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
  });
});
