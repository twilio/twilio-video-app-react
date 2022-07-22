import useFirebaseAuth from './useFirebaseAuth';
import { renderHook } from '@testing-library/react-hooks';
import { setImmediate } from 'timers';

const mockUser = { getIdToken: () => Promise.resolve('idToken') };

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => {
  const mockAuth = () => ({
    onAuthStateChanged: (fn: Function) => setImmediate(() => fn('mockUser')),
    signOut: jest.fn(() => Promise.resolve()),
  });
  const mockSignInWithPopup = jest.fn(() => Promise.resolve({ user: mockUser }));
  const mockGoogleAuthProvider = jest.fn(() => ({ addScope: jest.fn() }));
  return {
    getAuth: mockAuth,
    signInWithPopup: mockSignInWithPopup,
    GoogleAuthProvider: mockGoogleAuthProvider,
  };
});

// @ts-ignore
window.fetch = jest.fn(() => Promise.resolve({ json: () => ({ token: 'mockVideoToken' }) }));

describe('the useFirebaseAuth hook', () => {
  afterEach(jest.clearAllMocks);

  it('should set isAuthReady to true and set a user on load', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFirebaseAuth());
    expect(result.current.isAuthReady).toBe(false);
    expect(result.current.user).toBe(null);
    await waitForNextUpdate();
    expect(result.current.isAuthReady).toBe(true);
    expect(result.current.user).toBe('mockUser');
  });

  it('should set user to null on signOut', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFirebaseAuth());
    await waitForNextUpdate();
    result.current.signOut();
    await waitForNextUpdate();
    expect(result.current.isAuthReady).toBe(true);
    expect(result.current.user).toBe(null);
  });

  it('should set a new user on signIn', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFirebaseAuth());
    await waitForNextUpdate();
    result.current.signIn();
    await waitForNextUpdate();
    expect(result.current.user).toBe(mockUser);
  });

  it('should include the users idToken in request to the video token server', async () => {
    process.env.REACT_APP_TOKEN_ENDPOINT = 'http://test-endpoint.com/token';
    const { result, waitForNextUpdate } = renderHook(() => useFirebaseAuth());
    await waitForNextUpdate();
    result.current.signIn();
    await waitForNextUpdate();
    await result.current.getToken('testuser', 'testroom');
    expect(window.fetch).toHaveBeenCalledWith('http://test-endpoint.com/token', {
      headers: { _headers: { authorization: ['idToken'], 'content-type': ['application/json'] } },
      body: '{"user_identity":"testuser","room_name":"testroom","create_conversation":true}',
      method: 'POST',
    });
  });
});
