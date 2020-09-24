import React from 'react';
import { makeStyles } from '@material-ui/core';
import { TEST_DURATION } from '../PreflightTest';

const SIZE = 24;
const THICKNESS = 3;
const OUTER_RADIUS = SIZE / 2;
const INNER_RADIUS = OUTER_RADIUS - THICKNESS;
const INNER_CIRCUMFERENCE = 2 * Math.PI * INNER_RADIUS;

const useStyles = makeStyles(() => ({
  svg: {
    transform: 'rotate(-90deg)',
    marginRight: '0.6em',
    fill: 'none',
  },
  innerCircle: {
    stroke: 'rgb(200, 204, 207)',
  },
  circle: {
    stroke: '#027AC5',
    strokeDasharray: INNER_CIRCUMFERENCE,
    strokeDashoffset: '0px',
    animation: `${TEST_DURATION / 1000 + 1}s $progress linear`,
  },
  '@keyframes progress': {
    '0%': {
      strokeDashoffset: `${INNER_CIRCUMFERENCE}px`,
    },
    '100%': {
      strokeDashoffset: '0px',
    },
  },
}));

export default function ProgressIndicator() {
  const classes = useStyles();

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      strokeWidth={`${THICKNESS}px`}
      xmlns="http://www.w3.org/2000/svg"
      className={classes.svg}
    >
      <circle cx={OUTER_RADIUS} cy={OUTER_RADIUS} r={INNER_RADIUS} className={classes.innerCircle} />
      <circle cx={OUTER_RADIUS} cy={OUTER_RADIUS} r={INNER_RADIUS} className={classes.circle} />
    </svg>
  );
}
