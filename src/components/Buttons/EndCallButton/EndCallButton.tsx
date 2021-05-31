import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const history = useHistory();
  const classes = useStyles();
  const { room } = useVideoContext();

  const disconnectIt = () => {
    history.push('/thankyou');
    setTimeout(() => {
      room!.disconnect();
      console.log('disconnected');
    }, 200);
  };

  return (
    <Button onClick={() => disconnectIt()} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Sair
    </Button>
  );
}
