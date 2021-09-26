import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { ReactComponent as Next } from '../../assets/chevronDown.svg';
import { ReactComponent as Prev } from '../../assets/chevronUp.svg';

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react
 */

const VerticalCarousel = ({ data }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealedQuestion, setRevealedQuestion] = useState('');

  console.log(data);

  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(data.length / 2);
  console.log(halfwayIndex);

  // Usd to determine the height/spacing of each item
  const itemHeight = 155;

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;
  console.log(shuffleThreshold);

  // Used to determine which items should be visible. this prevents the "ghosting" animation
  const visibleStyleThreshold = shuffleThreshold / 2;

  const determinePlacement = (itemIndex: number) => {
    // If these match, the item is active
    if (activeIndex === itemIndex) return 0;

    if (itemIndex >= halfwayIndex) {
      if (activeIndex > itemIndex - halfwayIndex) {
        return (itemIndex - activeIndex) * itemHeight;
      } else {
        return -(data.length + activeIndex - itemIndex) * itemHeight;
      }
    }

    if (itemIndex > activeIndex) {
      return (itemIndex - activeIndex) * itemHeight;
    }

    if (itemIndex < activeIndex) {
      if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) {
        return (data.length - (activeIndex - itemIndex)) * itemHeight;
      }
      return -(activeIndex - itemIndex) * itemHeight;
    }

    return 0;
  };

  const handleClick = (direction: string) => {
    for (let i = 0; i < Math.random() * Math.random() * 1000; i++) {
      setTimeout(() => {
        setActiveIndex(prevIndex => {
          if (direction === 'next') {
            if (prevIndex + 1 > data.length - 1) {
              return 0;
            }
            return prevIndex + 1;
          }

          if (prevIndex - 1 < 0) {
            return data.length - 1;
          }

          return prevIndex - 1;
        });
      }, 200);
    }
  };

  const revealQuestion = () => {
    data.map((item: any, i: number) => {
      if (activeIndex === i) setRevealedQuestion(item.name);
    });
  };

  return (
    <div className="container h-screen w-full">
      <section className="outer-container flex justify-center items-center h-full">
        <div className="flex flex-col btn-wrapper">
          <button type="button" className="carousel-button prev shadow-lg" onClick={() => handleClick('prev')}>
            <Prev />
          </button>

          <button type="button" className="carousel-button next shadow-lg" onClick={() => handleClick('next')}>
            <Next />
          </button>
        </div>
        <div className="carousel-wrapper h-full">
          <div className="carousel h-full">
            <div className="slides h-full">
              <div className="carousel-inner">
                {data.map((item: any, i: number) => {
                  return (
                    <button
                      onClick={() => {
                        setActiveIndex(i);
                      }}
                      className={cn('carousel-item', {
                        active: activeIndex === i,
                        visible: Math.abs(determinePlacement(i)) <= visibleStyleThreshold,
                      })}
                      key={item.id}
                      style={{
                        transform: `translateY(${determinePlacement(i)}px) translateX(${
                          activeIndex === i
                            ? 0
                            : determinePlacement(i) > 0
                            ? 0.05 * determinePlacement(i)
                            : -0.05 * determinePlacement(i)
                        }px) rotate(${activeIndex === i ? 0 : -determinePlacement(i) / 30}deg)`,
                      }}
                    >
                      <div className="absolute -left-12 w-16 h-16 border-8 border-white text-white flex justify-center items-center rounded-full bg-red shadow-lg">
                        {i + 1}
                      </div>
                      <p>{item.category}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <button className="absolute w-16 h-16 rounded-full turn-card-btn" onClick={() => revealQuestion()}>
          <p className="text-3xl">-{`>`}</p>
        </button>
        <div className="content flex justify-start items-center ml-10">
          <div className="card flex text-center px-5 py-3">
            <p className="text-white text-lg font-bold">{revealedQuestion}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

VerticalCarousel.propTypes = {
  data: PropTypes.array.isRequired,
};

export default VerticalCarousel;
