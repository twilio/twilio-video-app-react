import React from 'react';
import { makeStyles } from '@material-ui/core';
import Participant from '../Participant/Participant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import { Pagination } from 'swiper';
import { RemoteParticipant } from 'twilio-video';

const useStyles = makeStyles({
  participantContainer: {
    position: 'absolute',
    display: 'flex',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: '0 auto',
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperSlide: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

export function MobileGridView() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const participants = useParticipants();

  const pages: RemoteParticipant[][] = [];

  // need to add local participant
  for (let i = 0; i < participants.length; i++) {
    const page = Math.floor(i / 6);
    if (!pages[page]) {
      pages[page] = [];
    }
    pages[page].push(participants[i]);
  }

  return (
    <div className={classes.participantContainer}>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        {pages.map((page, i) => (
          <SwiperSlide key={i} className={classes.swiperSlide}>
            {page.map(participant => (
              <div style={{ width: '50%' }}>
                <Participant participant={participant} />
              </div>
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
