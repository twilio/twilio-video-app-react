const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://video-app-79418.firebaseio.com',
});

module.exports = async function firebaseMiddleware(req, res, next) {
  try {
    const token = await admin.auth().verifyIdToken(req.get('authorization'));
    if (/@twilio.com$/.test(token.email)) {
      next();
    } else {
      res.status(401);
      res.send();
    }
  } catch {
    res.status(401);
    res.send();
  }
};
