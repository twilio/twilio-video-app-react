import { Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import EndCallButton from '../MenuBar/Buttons/EndCallButton/EndCallButton';
import Menu from '../MenuBar/Menu/Menu';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    background: 'white',
    display: 'none',
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
      <Menu />
      <Typography variant="subtitle1">{room.name}</Typography>
      <EndCallButton />
    </Grid>
  );
}
