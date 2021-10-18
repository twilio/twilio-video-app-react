import { RequestHandler } from 'express';
import firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(require('./serviceAccountKey.json')),
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

const firebaseAuthMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send();
  }

  try {
    // Here we authenticate users be verifying the ID token that was sent
    const token = await firebaseAdmin.auth().verifyIdToken(authHeader);

    // Here we authorize users to use this application only if they have a
    // Twilio email address. The logic in this if statement can be changed if
    // you would like to authorize your users in a different manner.
    if (token.email && /@twilio.com$/.test(token.email)) {
      next();
    } else {
      res.status(401).send();
    }
  } catch {
    res.status(401).send();
  }
};

export default module.exports = firebaseAuthMiddleware;
