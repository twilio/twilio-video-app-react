import React from 'react';
import { makeStyles } from '@material-ui/core';
import Participant from '../Participant/Participant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import { Pagination } from 'swiper';
import { Participant as IParticipant } from 'twilio-video';

const useStyles = makeStyles({
  participantContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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

  const pages: IParticipant[][] = [[]];
  pages[0].push(room!.localParticipant);

  for (let i = 0; i < participants.length; i++) {
    const page = Math.floor(i / 6);
    if (!pages[page]) {
      pages[page] = [];
    }
    if (pages[page].length < 6) {
      pages[page].push(participants[i]);
    } else {
      pages[page + 1] = [participants[i]];
    }
  }

  const getVideoWidth = () => {
    let videoWidth;
    let videoHeight;

    switch (true) {
      case participants.length <= 2:
        videoWidth = '100%';
        break;

      case participants.length > 2:
        videoWidth = '50%';
        break;
    }
    return {
      width: videoWidth,
      height: videoHeight,
    };
  };

  return (
    <div className={classes.participantContainer}>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        {pages.map((page, i) => (
          <SwiperSlide key={i} className={classes.swiperSlide}>
            {page.map(participant => (
              <div style={getVideoWidth()}>
                <Participant participant={participant} isLocalParticipant={room!.localParticipant === participant} />
              </div>
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
