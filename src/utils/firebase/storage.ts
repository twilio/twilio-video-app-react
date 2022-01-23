import firebase from 'firebase';
import { getUid } from './base';

export const getStorage = () =>
  new Promise<firebase.storage.Storage>((resolve, reject) => {
    getUid().then(() => {
      resolve(firebase.storage());
    });
  });
