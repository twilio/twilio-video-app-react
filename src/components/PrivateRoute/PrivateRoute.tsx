import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAppState } from '../../state';

export default function PrivateRoute({ children, ...rest }: RouteProps) {
  const { isAuthReady, user } = useAppState();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user || process.env.REACT_APP_USE_FIREBASE_AUTH !== 'true' ? (
          children
        ) : isAuthReady ? (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        ) : null
      }
    />
  );
}
