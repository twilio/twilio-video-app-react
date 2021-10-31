import { ScreenType } from 'types';
import { db } from './base';
import { getSessionStore } from './session';

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
