import { db } from './base';
import { firestore } from 'firebase';
import { getSessionStore } from './session';
import { DEFAULT_QUESTION_COLOR, ICarouselGame, ICategory, IQuestion } from 'types/CarouselGame';
import { TCategoryStore } from 'types/CategoryDeck';

let _game: ICarouselGame;
let _baseSubscription: any;
const _subscriptions: { [key: string]: any } = {};

export const fetchQuestions = (groupToken: string) =>
  new Promise<IQuestion[]>((resolve, reject) => {
    try {
      const questionsRef = db().collection('questions');
      const categoriesRef = db().collection('categories');

      Promise.all([questionsRef.get(), categoriesRef.get(), fetchCarouselGame(groupToken)]).then(
        ([questionDocs, categoryDocs, game]) => {
          let allQuestions: IQuestion[] = [];
          questionDocs.forEach((doc: any) => {
            const question = doc.data() as IQuestion;
            const categoryDoc = categoryDocs.docs.find(c => c.id === question.catId);
            const category = categoryDoc !== undefined ? (categoryDoc.data() as ICategory) : undefined;

            if (category !== undefined) {
              question.category = category.name;
              question.color = category.color;
            } else {
              question.category = 'CATEGORY_NOT_SET';
              question.color = DEFAULT_QUESTION_COLOR;
            }

            if (game && game.categoryIds && game.categoryIds.length > 0) {
              if (game.categoryIds.includes(question.catId)) {
                allQuestions.push(question);
              }
            }
          });
          console.log(allQuestions);
          resolve(allQuestions);
        }
      );
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentPlayer = (groupToken: string, playerSid: string, currentPlayer?: string) => {
  getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .collection('games')
      .doc('carousel')
      .set(
        {
          currentSpinCount: 0,
          currentPlayer: playerSid,
          activeCard: -1,
          ...(currentPlayer !== playerSid && {
            playerRoundCount: {
              [playerSid]: firestore.FieldValue.increment(1),
            },
          }),
        },
        { merge: true }
      );
  });
};

export const setCarouselPosition = (groupToken: string, nextIndex: number) => {
  getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .collection('games')
      .doc('carousel')
      .update({
        currentSpinCount: firestore.FieldValue.increment(1),
        carouselPosition: nextIndex,
        seed: Date.now(),
      });
  });
};

export const setActiveCard = (groupToken: string, index: number) => {
  getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .collection('games')
      .doc('carousel')
      .set(
        {
          activeCard: index,
          // currentPlayer: '',
          currentSpinCount: 4,
        },
        { merge: true }
      );
  });

  setTimeout(resetCurrentPlayer, 15 * 1000);
};

export const resetCurrentPlayer = (groupToken: string) => {
  getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .collection('games')
      .doc('carousel')
      .set(
        {
          currentPlayer: '',
        },
        { merge: true }
      );
  });
};

export const subscribeToCarouselGame = (subId: string, groupToken: string, callback: (game: ICarouselGame) => void) => {
  _subscriptions[subId] = callback;

  if (_baseSubscription === undefined) {
    getSessionStore(groupToken).then(store => {
      _baseSubscription = db()
        .collection('sessions')
        .doc(store.doc.id)
        .collection('games')
        .doc('carousel')
        .onSnapshot(doc => {
          if (!doc) {
            return;
          }

          _game = fillWithDefaultValues(doc.data() as ICarouselGame);
          if (_game !== null) {
            Object.entries(_subscriptions).forEach(([key, cb]) => {
              if (typeof cb === 'function') {
                cb(_game);
              } else {
                delete _subscriptions[key];
              }
            });
          }
        });
    });
  } else if (_game !== undefined) {
    callback(_game);
  }
};

export const unsubscribeFromCarouselGame = (subId: string) => {
  delete _subscriptions[subId];
};

export const fetchCarouselGame = (groupToken: string) =>
  new Promise<ICarouselGame>((resolve, reject) => {
    getSessionStore(groupToken).then(store => {
      const ref = db()
        .collection('sessions')
        .doc(store.doc.id)
        .collection('games')
        .doc('carousel');

      ref.get().then(doc => {
        if (!doc) {
          return;
        }

        _game = fillWithDefaultValues(doc.data() as ICarouselGame);
        resolve(_game);
      });
    });
  });

const fillWithDefaultValues = (game?: ICarouselGame) => {
  const filled = game ?? ({} as ICarouselGame);

  filled.activeCard = game?.activeCard ?? undefined;
  filled.carouselPosition = game?.carouselPosition ?? 0;
  filled.currentPlayer = game?.currentPlayer ?? '#';
  filled.currentSpinCount = game?.currentSpinCount ?? 0;
  filled.playerRoundCount = game?.playerRoundCount ?? {};
  filled.seed = game?.seed ?? 0;
  filled.categoryIds = game?.categoryIds ?? [];

  return filled;
};

export const addQuestionDeck = (categoryStore: TCategoryStore) =>
  new Promise<string[]>((resolve, reject) => {
    const batch = db().batch();

    const catIds: string[] = [];

    Object.values(categoryStore).forEach(cat => {
      const catRef = db()
        .collection('categories')
        .doc();
      batch.set(catRef, {
        name: cat.value,
        color: '#f00',
      });

      Object.values(cat.questions).forEach(q => {
        const qRef = db()
          .collection('questions')
          .doc();
        batch.set(qRef, {
          catId: catRef.id,
          name: q.value,
        });
      });

      catIds.push(catRef.id);
    });

    batch.commit();

    resolve(catIds);
  });

// create colored categories from all questions
// export const createCategories = () => {
//   const colors = [
//     "#821C82",
//     "#C9084D",
//     "#F7A70A",
//     "#EE4A23",
//     "#E60037",
//     "#F27817",
//   ]

//   const categories: { [key: string]: string } = {};

//   const qRef = db().collection('questions');
//   const cRef = db().collection('categories');

//   qRef.get().then(docs => {
//     let i = 0;
//     docs.forEach(qDoc => {
//       const data = qDoc.data() as IQuestion;
//       if (!Object.values(categories).includes(data.category)) {
//         if (i >= colors.length) {
//           i = 0;
//           console.error("not enough unique categorie colors!");
//         }
//         const cDoc = cRef.doc();
//         categories[cDoc.id] = data.category;
//         cDoc.set({
//           name: data.category,
//           color: colors[i],
//         });

//         i++;
//       }

//       const cat = Object.entries(categories).find(([key, cat]) => cat == data.category);
//       if (cat && cat.length == 2) {
//         qRef.doc(qDoc.id).update({
//           catId: cat[0],
//         });
//       } else {
//         console.error("could not find category for", qDoc);
//       }

//       // Object.entries(categories).forEach(([key, cat]) => {
//       //   console.log
//       //   if (cat === data.category) {
//       //     console.log("matched", cat, data.category);
//       //     questions[key] = { catId: key, name: data.name };
//       //   }
//       // });
//     })

//     // console.log(categories);
//     // console.log(questions);
//   });
// }
