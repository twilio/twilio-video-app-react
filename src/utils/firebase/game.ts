import { ICarouselGame, IQuestion } from 'types';
import { db } from './base';
import { firestore } from 'firebase';
import { getSessionStore } from './session';

let _game: ICarouselGame;
let _baseSubscription: any;
const _subscriptions: { [key: string]: any } = {};

export const fetchQuestions = () =>
  new Promise<IQuestion[]>((resolve, reject) => {
    try {
      const ref = db().collection('questions');

      ref.get().then(docs => {
        let allQuestions: IQuestion[] = [];
        docs.forEach((doc: any) => {
          const data = doc.data();
          allQuestions.push(data);
        });
        resolve(allQuestions);
      });
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

          _game = doc.data() as ICarouselGame;
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

        _game = doc.data() as ICarouselGame;
        if (_game !== null) {
          resolve(_game);
        } else {
          reject({ empty: true });
        }
      });
    });
  });
