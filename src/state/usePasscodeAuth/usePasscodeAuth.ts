import { useCallback, useEffect, useState } from 'react';

function getPasscode() {
  const match = window.location.search.match(/appcode=(.*)&?/);
  const passcode = match ? match[1].slice(0, 6) : window.sessionStorage.getItem('passcode');
  return passcode;
}

function fetchToken(name: string, room: string, passcode: string) {
  return fetch(`/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ user_identity: name, room_name: room, passcode }),
    mode: 'cors',
  });
}

function verifyPasscode(passcode: string) {
  return fetchToken('verification name', 'verification room', passcode).then(async res => {
    const jsonResponse = await res.json();
    if (res.status === 401) {
      return { isValid: false, error: jsonResponse.type };
    }

    if (res.ok && jsonResponse.token) {
      return { isValid: true };
    }
  });
}

function getErrorMessage(message: string) {
  switch (message) {
    case 'unauthorized':
      return 'Appcode is incorrect';
    case 'expired':
      return 'Appcode has expired';
    default:
      return message;
  }
}

export default function usePasscodeAuth() {
  const [user, setUser] = useState<{ displayName: undefined; photoURL: undefined; passcode: string } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const getToken = useCallback(
    (name: string, room: string) => {
      return fetchToken(name, room, user!.passcode)
        .then(res => res.json())
        .then(res => res.token as string);
    },
    [user]
  );

  useEffect(() => {
    const passcode = getPasscode();

    if (passcode) {
      verifyPasscode(passcode)
        .then(verification => {
          if (verification?.isValid) {
            setUser({ passcode } as any);
            window.sessionStorage.setItem('passcode', passcode);
          }
        })
        .then(() => setIsAuthReady(true));
    } else {
      setIsAuthReady(true);
    }
  }, []);

  const signIn = useCallback((passcode: string) => {
    return verifyPasscode(passcode).then(verification => {
      if (verification?.isValid) {
        setUser({ passcode } as any);
        window.sessionStorage.setItem('passcode', passcode);
      } else {
        throw new Error(getErrorMessage(verification?.error));
      }
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.sessionStorage.removeItem('passcode');
    return Promise.resolve();
  }, []);

  return { user, isAuthReady, getToken, signIn, signOut };
}
