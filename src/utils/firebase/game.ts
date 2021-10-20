import { ICarouselGame, IQuestion, ScreenType, UserGroup } from 'types';
import { getSessionStore } from '.';
import { db } from './base';

let _game: ICarouselGame;
const _subscriptions: { [key: string]: any } = {};

export const fetchQuestions = () =>
  new Promise<IQuestion[]>((resolve, reject) => {
    try {
      const ref = db().collection('questions');

      ref.get().then(docs => {
        let allQuestions: any[] = [];
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

export const setCurrentPlayer = (groupToken: string, playerName: string) => {
  getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .collection('games')
      .doc('carousel')
      .set(
        {
          currentPlayer: playerName,
          activeCard: -1,
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
      .set(
        {
          carouselPosition: nextIndex,
          seed: Date.now(),
        },
        { merge: true }
      );
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

export const subscribeToCarouselGame = (
  subName: string,
  groupToken: string,
  callback: (game: ICarouselGame) => void
) => {
  getSessionStore(groupToken).then(store => {
    if (_subscriptions[subName]) {
      _subscriptions[subName]();
      delete _subscriptions[subName];
    }
    _subscriptions[subName] = db()
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
          callback(_game);
        }
      });
  });
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
