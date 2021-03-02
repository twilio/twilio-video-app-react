import { RequestHandler } from 'express';
import firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(require('./serviceAccountKey.json')),
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

const verifyIdToken = firebaseAdmin.auth().verifyIdToken;

const firebaseAuthMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send();
  }

  try {
    const token = await verifyIdToken(authHeader);
    if (token.email && /@twilio.com$/.test(token.email)) {
      next();
    } else {
      res.status(401).send();
    }
  } catch {
    res.status(401).send();
  }
};

export default firebaseAuthMiddleware;
