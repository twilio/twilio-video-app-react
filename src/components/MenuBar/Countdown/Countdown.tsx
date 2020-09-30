import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import useCountdown from '../../../hooks/useCountdown/useCountdown'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: '1em',
      fontSize: '1.3em',
    },
  })
);

export default function Countdown() {
  const timeLeft = useCountdown();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      { timeLeft.minutes < 10 ? (
        <span>
        { timeLeft.minutes < 10 ? `0${ timeLeft.minutes }` : timeLeft.minutes }:{ timeLeft.seconds < 10 ? `0${ timeLeft.seconds }` : timeLeft.seconds }
        </span>
      ) : null
      }
    </div>
  )
}
