import React, { useCallback, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import useStatsListener from '../../../hooks/useStatsListener/useStatsListener';

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

export default function ToggleStatsButton(props: { className?: string }) {
  const classes = useStyles();
  const [isStatsEnabled, stats, toggleStatsListener] = useStatsListener();

  useEffect(() => {
    if (stats) {
      console.log('[statsListener]', stats);
    }
  }, [stats]);

  useEffect(() => {
    console.log(`[statsListener] is ${isStatsEnabled ? 'enabled' : 'disabled'}`);
  }, [isStatsEnabled]);

  const toggleStats = useCallback(() => {
    toggleStatsListener();
  }, [toggleStatsListener]);

  return (
    <Button
      className={clsx(classes.button, props.className)}
      onClick={toggleStats}
      style={{ margin: '0 0 0 10px' }}
      data-cy-toggle-stats
    >
      {!isStatsEnabled ? 'Enable Stats' : 'Disable Stats'}
    </Button>
  );
}
