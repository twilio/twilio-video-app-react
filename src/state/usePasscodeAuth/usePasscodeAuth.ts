import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RoomType } from '../../types';

export function getPasscode() {
  const match = window.location.search.match(/passcode=(.*)&?/);
  const passcode = match ? match[1] : window.sessionStorage.getItem('passcode');
  return passcode;
}

export function fetchToken(
  name: string,
  room: string,
  passcode: string,
  create_room = true,
  create_conversation = process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true'
) {
  return fetch(`/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      user_identity: name,
      room_name: room,
      passcode,
      create_room,
      create_conversation,
    }),
  });
}

export function verifyPasscode(passcode: string) {
  return fetchToken('temp-name', 'temp-room', passcode, false /* create_room */, false /* create_conversation */).then(
    async res => {
      const jsonResponse = await res.json();
      if (res.status === 401) {
        return { isValid: false, error: jsonResponse.error?.message };
      }

      if (res.ok && jsonResponse.token) {
        return { isValid: true };
      }
    }
  );
}

export function getErrorMessage(message: string) {
  switch (message) {
    case 'passcode incorrect':
      return 'Passcode is incorrect';
    case 'passcode expired':
      return 'Passcode has expired';
    default:
      return message;
  }
}

export default function usePasscodeAuth() {
  const history = useHistory();

  const [user, setUser] = useState<{ displayName: undefined; photoURL: undefined; passcode: string } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [roomType, setRoomType] = useState<RoomType>();

  const getToken = useCallback(
    (name: string, room: string) => {
      return fetchToken(name, room, user!.passcode)
        .then(async res => {
          if (res.ok) {
            return res;
          }
          const json = await res.json();
          const errorMessage = getErrorMessage(json.error?.message || res.statusText);
          throw Error(errorMessage);
        })
        .then(res => res.json())
        .then(res => {
          setRoomType(res.room_type);
          return res.token as string;
        });
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
            history.replace(window.location.pathname);
          }
        })
        .then(() => setIsAuthReady(true));
    } else {
      setIsAuthReady(true);
    }
  }, [history]);

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

  return { user, isAuthReady, getToken, signIn, signOut, roomType };
}
