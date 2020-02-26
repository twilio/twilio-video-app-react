import usePasscodeAuth, { getPasscode, verifyPasscode, getErrorMessage } from './usePasscodeAuth';
import { act, renderHook } from '@testing-library/react-hooks';

delete window.location;
// @ts-ignore
window.location = {
  search: '',
};

describe('the usePasscodeAuth hook', () => {
  describe('on first render', () => {
    beforeEach(() => window.sessionStorage.clear());
    it('should return a user when the appcode is valid', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => ({ token: 'mockVideoToken' }) }));
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth);
      await waitForNextUpdate();
      expect(result.current).toMatchObject({ isAuthReady: true, user: { passcode: '123123' } });
    });

    it('should remove the query parameter from the URL when the appcode is valid', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => ({ token: 'mockVideoToken' }) }));
      // @ts-ignore
      window.location = {
        search: '?appcode=000000',
        origin: 'http://test-origin',
        pathname: '/test-pathname',
      };
      Object.defineProperty(window.history, 'replaceState', { value: jest.fn() });
      window.sessionStorage.setItem('passcode', '123123');
      const { waitForNextUpdate } = renderHook(usePasscodeAuth);
      await waitForNextUpdate();
      expect(window.history.replaceState).toHaveBeenCalledWith({}, '', 'http://test-origin/test-pathname');
    });

    it('should not return a user when the app code is invalid', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ status: 401, json: () => ({ type: 'errorMessage' }) }));
      window.location.search = ''
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth);
      await waitForNextUpdate();
      expect(result.current).toMatchObject({ isAuthReady: true, user: null });
    });

    it('should not return a user when there is no appcode', () => {
      const { result } = renderHook(usePasscodeAuth);
      expect(result.current).toMatchObject({ isAuthReady: true, user: null });
    });
  });

  describe('signout function', () => {
    it('should clear session storage and user on signout', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => ({ token: 'mockVideoToken' }) }));
      window.sessionStorage.setItem('passcode', '123123');
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth);
      await waitForNextUpdate();
      await act(() => result.current.signOut());
      expect(window.sessionStorage.getItem('passcode')).toBe(null);
      expect(result.current.user).toBe(null);
    });
  });

  describe('signin function', () => {
    it('should set a user when a valid appcode is submitted', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => ({ token: 'mockVideoToken' }) }));
      const { result } = renderHook(usePasscodeAuth);
      await act(() => result.current.signIn('123456'));
      expect(result.current.user).toEqual({ passcode: '123456' });
    });

    it('should return an error when an invalid appcode is submitted', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ status: 401, json: () => ({ type: 'unauthorized' }) }));
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth);
      await waitForNextUpdate();
      result.current.signIn('123456').catch(err => {
        expect(err.message).toBe('Appcode is incorrect');
      });
    });

    it('should return an error when an expired appcode is submitted', async () => {
      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ status: 401, json: () => ({ type: 'expired' }) }));
      const { result, waitForNextUpdate } = renderHook(usePasscodeAuth);
      await waitForNextUpdate();
      result.current.signIn('123456').catch(err => {
        expect(err.message).toBe('Appcode has expired');
      });
    });
  });
});

describe('the getPasscode function', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('should return the appcode from session storage', () => {
    window.location.search = ''
    window.sessionStorage.setItem('passcode', '123123');
    expect(getPasscode()).toBe('123123');
  });

  it('should return the appcode from the URL', () => {
    window.location.search = '?appcode=234234';

    expect(getPasscode()).toBe('234234');
  });

  it('should return the appcode from the URL when the app code is also sotred in sessionstorage', () => {
    window.sessionStorage.setItem('passcode', '123123');
    window.location.search = '?appcode=234234';

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
    window.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => ({ token: 'mockVideoToken' }) }));

    const result = await verifyPasscode('123456');
    expect(result).toEqual({ isValid: true });
  });

  it('should return the correct response when the passcode is invalid', async () => {
    // @ts-ignore
    window.fetch = jest.fn(() => Promise.resolve({ status: 401, json: () => ({ type: 'errorMessage' }) }));

    const result = await verifyPasscode('123456');
    expect(result).toEqual({ isValid: false, error: 'errorMessage' });
  });

  it('should call the API with the correct parameters', async () => {
    await verifyPasscode('123456');
    expect(window.fetch).toHaveBeenLastCalledWith('/token', {
      body: '{"user_identity":"verification name","room_name":"verification room","passcode":"123456"}',
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
  });
});
