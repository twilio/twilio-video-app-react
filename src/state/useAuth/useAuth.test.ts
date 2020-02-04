import useAuth from './useAuth';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('firebase/app', () => {
  const mockAuth = () => ({
    onAuthStateChanged: (fn: Function) => setImmediate(() => fn('mockUser')),
    signInWithPopup: jest.fn(() => Promise.resolve({ user: 'mockUser2' })),
    signOut: jest.fn(() => Promise.resolve()),
  });
  mockAuth.GoogleAuthProvider = jest.fn(() => ({ addScope: jest.fn() }));
  return {
    auth: mockAuth,
    initializeApp: jest.fn(),
  };
});

jest.mock('firebase/auth');

describe('the useAuth hook', () => {
  afterEach(jest.clearAllMocks);

  describe('with auth enabled', () => {
    it('should set isAuthReady to true and set a user on load', async () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';
      const { result, waitForNextUpdate } = renderHook(() => useAuth());
      expect(result.current.isAuthReady).toBe(false);
      expect(result.current.user).toBe(null);
      await waitForNextUpdate();
      expect(result.current.isAuthReady).toBe(true);
      expect(result.current.user).toBe('mockUser');
    });

    it('should set user to null on signOut', async () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';
      const { result, waitForNextUpdate } = renderHook(() => useAuth());
      await waitForNextUpdate();
      result.current.signOut();
      await waitForNextUpdate();
      expect(result.current.isAuthReady).toBe(true);
      expect(result.current.user).toBe(null);
    });

    it('should set a new user on signIn', async () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';
      const { result, waitForNextUpdate } = renderHook(() => useAuth());
      await waitForNextUpdate();
      result.current.signIn();
      await waitForNextUpdate();
      expect(result.current.user).toBe('mockUser2');
    });
  });

  describe('with auth disabled', () => {
    it('should not initialize', done => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'false';
      const { result } = renderHook(() => useAuth());
      setImmediate(() => {
        expect(result.current.isAuthReady).toBe(false);
        done();
      });
    });
  });
});
