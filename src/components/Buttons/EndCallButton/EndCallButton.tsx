import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as queryString from 'query-string';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

import watchRTC from '@testrtc/watchrtc-sdk';

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
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Button
      onClick={() => {
        room.disconnect();

        let rating = Math.floor(Math.random() * 5) as any;
        let message = `User rating is ${rating}`;

        const ratingFromQuery = queryString.parse(window.location.search)?.rating;
        const ratingMessageFromQuery = queryString.parse(window.location.search)?.ratingMessage;

        if (typeof ratingFromQuery === 'string') {
          rating = Number(ratingFromQuery);
        }
        if (typeof ratingMessageFromQuery === 'string') {
          message = decodeURI(ratingMessageFromQuery);
        }
        watchRTC.setUserRating(rating, message);
      }}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
    >
      Disconnect
    </Button>
  );
}
