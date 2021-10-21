import { ScreenType } from 'types';
import { getSessionStore } from '.';
import { db } from './base';

export const setActiveScreen = (groupToken: string, screen: ScreenType) => {
  getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .set(
        {
          activeScreen: screen,
        },
        { merge: true }
      );
  });
};
