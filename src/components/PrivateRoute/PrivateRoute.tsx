import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAppState } from '../../state';

export default function PrivateRoute({ children, ...rest }: RouteProps) {
  const { isAuthReady, user } = useAppState();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
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
