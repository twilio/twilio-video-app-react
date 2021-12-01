import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import useSessionContext from 'hooks/useSessionContext';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import {
  setActiveCard,
  setCarouselPosition,
  subscribeToCarouselGame,
  unsubscribeFromCarouselGame,
} from 'utils/firebase/game';
import useGameContext from 'hooks/useGameContext';
import { RevealedCard } from 'components/RevealedCard';
import { ISessionStatus } from 'components/SessionProvider';
import { ICarouselGame, IQuestion } from 'types';
import { unsubscribeFromSessionStore } from 'utils/firebase/session';
import { RoundButton } from 'components/Buttons/RoundButton';

const MAX_SPIN_COUNT = 3;

const InfoRow = (props: { iconSrc: string; text: string }) => (
  <div className="flex items-center space-x-4 py-2">
    <img src={props.iconSrc} alt="Info Icon" />
    <span>{props.text}</span>
  </div>
);

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react
 */

const VerticalCarousel = ({ questions }: { questions: IQuestion[] }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const { revealedCard, setRevealedCard } = useGameContext();
  const [revealableIndex, setRevealableIndex] = useState<number>();
  const { groupToken, sessionStatus } = useSessionContext();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [, setSeed] = useState<ICarouselGame['seed']>();
  const [spinTimeouts, setSpinTimeouts] = useState([] as NodeJS.Timeout[]);
  const [remainingSpins, setRemainingSpins] = useState<number>(MAX_SPIN_COUNT);
  const [isActivePlayer, setIsActivePlayer] = useState(false);
  const activeIndexRef = useRef<number>();
  activeIndexRef.current = activeIndex;

  const screenWidth = window.screen.width;

  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(questions.length / 2);

  // Usd to determine the height/spacing of each item
  let itemHeight = screenWidth > 1536 ? 150 : 100;

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // Used to determine which items should be visible. this prevents the "ghosting" animation
  const visibleStyleThreshold = shuffleThreshold / 2;

  const determinePlacement = (itemIndex: number) => {
    if (activeIndex === undefined) {
      return 0;
    }
    // If these match, the item is active
    if (activeIndex === itemIndex) return 0;

    if (itemIndex >= halfwayIndex) {
      if (activeIndex > itemIndex - halfwayIndex) {
        return (itemIndex - activeIndex) * itemHeight;
      } else {
        return -(questions.length + activeIndex - itemIndex) * itemHeight;
      }
    }

    if (itemIndex > activeIndex) {
      return (itemIndex - activeIndex) * itemHeight;
    }

    if (itemIndex < activeIndex) {
      if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) {
        return (questions.length - (activeIndex - itemIndex)) * itemHeight;
      }
      return -(activeIndex - itemIndex) * itemHeight;
    }

    return 0;
  };

  const handleClick = () => {
    if (spinTimeouts.length > 0) {
      return;
    }

    const nextCard = Math.round(Math.random() * (questions.length - 1));
    setCarouselPosition(groupToken as string, nextCard);
  };

  const revealQuestion = () => {
    if (activeIndex) {
      setRevealedCard(questions[activeIndex]);
    }
  };

  const approveQuestion = () => {
    if (activeIndex) {
      setActiveCard(groupToken as string, activeIndex);
    }
  };

  const spinTo = (newPos: number) => {
    if (!activeIndex) {
      return;
    }

    if (spinTimeouts.length > 0) {
      for (let _t of spinTimeouts) {
        clearTimeout(_t);
      }
      setSpinTimeouts([]);
    }

    const diff = newPos - activeIndex;
    const dir = diff >= 0 ? 1 : -1;
    const steps = Math.abs(diff);

    const startTime = Date.now();
    const duration = 6000;
    const sqDuration = Math.sqrt(duration * 0.1);

    let next: number;
    const timeouts = [];
    for (let i = 0; i < duration; i += 20) {
      timeouts.push(
        setTimeout(() => {
          const dt = Date.now() - startTime;
          const doneSteps = (Math.sqrt(dt * 0.1) / sqDuration) * steps;
          const dirSteps = doneSteps * dir;

          next = (activeIndex + dirSteps) % questions.length;
          if (next < 0) {
            next = questions.length - 1 + next;
          }

          setActiveIndex(next);
        }, i)
      );
    }

    timeouts.push(
      setTimeout(() => {
        setActiveIndex(newPos);
        setSpinTimeouts([]);
      }, duration + 50)
    );

    setSpinTimeouts(timeouts);
  };

  useEffect(() => {
    const subId = 'GAME';

    subscribeToCarouselGame(subId, groupToken as string, game => {
      const currentCard = game.carouselPosition ?? 0;
      const _activeIndex = activeIndexRef.current;
      if (_activeIndex === -1) {
        setActiveIndex(currentCard);
      }
      setSeed(_seed => {
        if (_seed !== undefined && _seed !== game.seed) {
          spinTo(currentCard);
        }
        return game.seed;
      });

      setIsActivePlayer(localParticipant.sid === game.currentPlayer);
      setRemainingSpins(MAX_SPIN_COUNT - game.currentSpinCount);
      setRevealableIndex(game.activeCard);
    });

    return () => {
      unsubscribeFromCarouselGame(subId);
    };
  }, []);

  useEffect(() => {
    if (revealableIndex && questions && revealableIndex >= 0 && questions.length > revealableIndex) {
      setRevealedCard(questions[revealableIndex]);
    } else if (revealableIndex === -1) {
      setRevealedCard(undefined);
    }
  }, [questions, revealableIndex]);

  if (sessionStatus !== ISessionStatus.SESSION_RUNNING || activeIndex === -1) {
    return null;
  }

  const canSpin = isActivePlayer && remainingSpins > 0 && spinTimeouts.length <= 0;
  const canChoose = isActivePlayer && remainingSpins >= 0 && spinTimeouts.length <= 0;
  const canReveal = revealedCard !== undefined && canChoose;

  return (
    <div className="container h-full shadow-lg mx-auto px-2 lg:px-5 overflow-hidden">
      <section className="outer-container flex justify-between items-center h-full w-full">
        <div className={'flex flex-col'}>
          <RoundButton
            title="Zum Drehen des Rads hier klicken"
            onClick={handleClick}
            disabled={!canSpin}
            invisible={!canSpin}
            indicator={remainingSpins > 0 ? remainingSpins : undefined}
          >
            <img src="/assets/random-card.svg" alt="Neue Kategorie" />
          </RoundButton>
        </div>
        <div className="h-full relative px-20 transform -translate-x-20">
          {questions.map((item, i) => {
            const pos = determinePlacement(i);
            const visible = Math.abs(pos) <= visibleStyleThreshold;
            const isActive = Math.round(activeIndex ?? 0) === i;

            let tx, ty;
            if (visible) {
              tx = activeIndex === i ? 0 : (Math.sqrt(Math.abs(pos) * 0.11) * 0.05 * pos * pos) / Math.abs(pos);
              ty = pos;
            } else {
              const edgePos = (visibleStyleThreshold * Math.abs(pos)) / pos;
              ty = edgePos;
              tx = (Math.sqrt(Math.abs(edgePos) * 0.11) * 0.05 * edgePos * edgePos) / Math.abs(edgePos);
            }

            return (
              <div
                className={cn('cursor-default z-0 relative flex items-center justify-center', 'carousel-item', {
                  visible,
                })}
                key={i}
                style={{
                  transform: `translateY(${pos}px) translateX(${tx}px) rotate(${activeIndex === i ? 0 : -pos / 12}deg)`,
                  zIndex: -1 * Math.abs(pos / itemHeight) + questions.length,
                }}
              >
                <div className="absolute -left-12 2xl:-left-8 top-0 bottom-0 flex items-center">
                  <div
                    className="w-16 h-16 text-3xl shadow-xl flex justify-center items-center rounded-full border-8 border-white"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <p
                  style={{
                    color: item.color,
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {item.category}
                </p>
              </div>
            );
          })}
        </div>
        <RoundButton
          title="Zum Anzeigen der Frage hier klicken"
          invisible={!canChoose}
          disabled={!canChoose}
          onClick={() => revealQuestion()}
          active
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </RoundButton>
        <div className="flex justify-center items-center space-x-5">
          <div className="flex flex-col justify-center space-y-3 w-56 lg:w-96">
            <InfoRow
              iconSrc="/assets/info.svg"
              text="Sollte dir die angezeigte Frage nicht gefallen, ist das kein Problem. Du kannst insgesamt 3x am DemokraTisch-Rad drehen, da ist auf jeden Fall die passende Frage für dich dabei. Los gehts!"
            />
            <div className="w-full h-32 lg:h-60">
              <RevealedCard />
            </div>
            <InfoRow
              iconSrc="/assets/info.svg"
              text="Bitte bedenke: Drehst du mehrmals, kannst du nicht zwischen den Fragen wählen. Die Frage ist nur solange für dich sichtbar, bis du sie mit dem Haken links für alle zur Diskussion freigibst. Viel Spaß!"
            />
          </div>
          <RoundButton
            title="Hier Klicken zum Freigeben der Frage für alle zur Diskussion. Frage ist für alle sichtbar."
            onClick={approveQuestion}
            disabled={!canReveal}
            active
            invisible={!canReveal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </RoundButton>
        </div>
      </section>
    </div>
  );
};

export default VerticalCarousel;
