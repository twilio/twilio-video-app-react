import { Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import EndCallButton from '../MenuBar/Buttons/EndCallButton/EndCallButton';
import Menu from '../MenuBar/Menu/Menu';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    background: 'white',
    paddingLeft: '1em',
    display: 'none',
    height: `${theme.mobileTopBarHeight}px`,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
}));

export default function MobileTopMenuBar() {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Grid container alignItems="center" justify="space-between" className={classes.container}>
      <Typography variant="subtitle1">{room.name}</Typography>
      <div>
        <EndCallButton />
        <Menu />
      </div>
    </Grid>
  );
}
