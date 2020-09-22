import React from 'react';
import usePreflightTest from './usePreflightTest/usePreflightTest';
import { makeStyles, Typography, Grid } from '@material-ui/core';
import useGetPreflightTokens from './useGetPreflightTokens/useGetPreflightTokens';
import getNetworkCondition from './getNetworkCondition/getNetworkCondition';
import ProgressIndicator from './ProgressIndicator/ProgressIndicator';
import { SuccessIcon } from './icons/SuccessIcon';
import WarningIcon from './icons/WarningIcon';
import ErrorIcon from './icons/ErrorIcon';

export const TEST_DURATION = 10000;

export enum NetworkCondition {
  Red,
  Yellow,
  Green,
}

const useStyles = makeStyles({
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '0.4em',
  },
  result: {
    color: 'white',
  },
});

function Result({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  const classes = useStyles();
  return (
    <>
      {icon && <div className={classes.iconContainer}>{icon}</div>}
      <Typography variant="subtitle2" className={classes.result}>
        {children}
      </Typography>
    </>
  );
}

export function ResultComponent({
  networkCondition,
  tokenError,
  testFailure,
}: {
  networkCondition?: NetworkCondition;
  tokenError?: Error;
  testFailure?: Error;
}) {
  if (tokenError || testFailure) {
    return <Result icon={<ErrorIcon />}>There was a problem connecting to the network</Result>;
  }

  if (networkCondition === NetworkCondition.Red) {
    return (
      <Result icon={<ErrorIcon />}>
        Poor network conditions. You may experience poor call quality and reliability.
      </Result>
    );
  }

  if (networkCondition === NetworkCondition.Yellow) {
    return (
      <Result icon={<WarningIcon />}>Poor network conditions. You may experience degraded video performance.</Result>
    );
  }

  if (networkCondition === NetworkCondition.Green) {
    return <Result icon={<SuccessIcon />}>Your Network Connection is Stable</Result>;
  }

  return null;
}

export default function PreflightTest() {
  const classes = useStyles();

  const { tokens, tokenError } = useGetPreflightTokens();
  const { testFailure, testReport, isTestRunning } = usePreflightTest(tokens?.[0], tokens?.[1]);

  const networkCondition = getNetworkCondition(testReport);

  return (
    <Grid container justify="center" alignItems="center">
      {!testFailure && !testReport ? (
        <>
          <ProgressIndicator />
          <Typography variant="subtitle2" className={classes.result}>
            Checking your network connection
          </Typography>
        </>
      ) : (
        <ResultComponent networkCondition={networkCondition} tokenError={tokenError} testFailure={testFailure} />
      )}
    </Grid>
  );
}
