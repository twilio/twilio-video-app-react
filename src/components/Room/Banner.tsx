import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      color: 'black',
      gridRow: `1`,
      gridColumn: `2`,
    },
  };
});

export default function Banner() {
  const classes = useStyles();

  return <div className={clsx(classes.container)}>Virtual Waiting Room </div>;
}
