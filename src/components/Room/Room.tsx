import React from 'react';
import ChatWindow from '../ChatWindow/ChatWindow';
import useSessionContext from 'hooks/useSessionContext';
import { GridVideoChatLayout } from 'components/Layouts/GridVideoChatLayout';
import { CarouselGameLayout } from 'components/Layouts/CarouselGameLayout';
import useParticipants from 'hooks/useParticipants/useParticipants';
import { categorizeParticipants } from 'utils/participants';
import ParticipantTracks from 'components/ParticipantTracks/ParticipantTracks';
import { ScreenType } from 'types/ScreenType';
import { UserGroup } from 'types/UserGroup';

const PoweredByBar = () => (
  <div className="fixed bottom-2 px-2 z-0 w-full flex items-center justify-between h-12 lg:h-20">
    <img src="/assets/artikel1.png" alt="Artikel1 Logo" className="h-full" />
    <img src="/assets/demokratisch.png" alt="DemokraTisch Logo" className="h-full" />
  </div>
);

export default function Room() {
  const { activeScreen, userGroup } = useSessionContext();
  const participants = useParticipants();
  const { translatorParticipant } = categorizeParticipants(participants);

  const CurrentScreen = () => {
    if (activeScreen === ScreenType.Game) {
      return <CarouselGameLayout />;
    } else if (activeScreen === ScreenType.VideoChat) {
      return <GridVideoChatLayout />;
    }

    return null;
  };

  return (
    <>
      {userGroup === UserGroup.StreamServerTranslated && translatorParticipant ? (
        <div className="fixed top-0 h-0 w-0">
          <ParticipantTracks participant={translatorParticipant} audioOnly />
        </div>
      ) : null}
      <div className="flex flex-col h-screen">
        <div
          className="flex-grow flex"
          style={{
            paddingBottom:
              userGroup === UserGroup.StreamServer || userGroup === UserGroup.StreamServerTranslated ? '2rem' : '8rem',
          }}
        >
          <ChatWindow />
          <div className="px-5 container mx-auto lg:px-32">
            <CurrentScreen />
          </div>
          <PoweredByBar />
        </div>
        {/* <BackgroundSelectionDialog /> */}
      </div>
    </>
  );
}
