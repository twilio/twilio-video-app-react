# twilio-video-app-react

[![CircleCI](https://circleci.com/gh/twilio/twilio-video-app-react.svg?style=svg&circle-token=9d6b1e89d148181aaa6874c29849c730b8ca406d)](https://circleci.com/gh/twilio/twilio-video-app-react)

This is a collaboration application built with the [twilio-video.js SDK](https://github.com/twilio/twilio-video.js) and [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

Run `npm install` to install all dependencies.

In order to run the local token server (which is required to connect to a room), you will need to create an account in the [Twilio Console](https://www.twilio.com/console). After you log in to the console, click on 'Settings' and find your Account SID.

Next, you'll need to create an API Key and Secret. You can do this in the [API Keys Section](https://www.twilio.com/console/video/project/api-keys) under Tools in the Twilio Console.

Once you have your Account SID, API Key, and API Secret, store them in a new file called `.env` (example below).

```
ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Now the local token server (see `server.js`) can dispense Access Tokens to connect to a Room.

### Running the App

#### `npm start`

This will start the local token server and run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to see the application in the browser.

The page will reload if you make changes to the source code in `src/`.
You will also see any linting errors in the console.

#### `npm run server`

This will run the token server.

The token server runs on port 8080 and expects a `POST` request at the `/token` route with the following JSON body:

```
{
  name: string,  // the user's identity
  room: string   // the room name
}
```

The response is the following JSON object:

```
{
  token: string
}
```

Try it out with this sample `curl` command:

`curl 'http://localhost:8080/token' -X POST -d '{"name":"My Name","room":"My Room"}'`

### Getting Multiple Participants in a Room

If you want to see how the application behaves with multiple participants, you can simply open `localhost:3000` in multiple tabs in your browser and connect to the same room using different user names.

Or, if you'd like to invite real people to join a room, you can use the free tool [ngrok](https://ngrok.com/). Once you get ngrok set up, run `npm start` and then use the following command to create a shareable link:

`./ngrok ngrok http --host-header=rewrite 3000`

Note: Your browser only lets you use audio and video when connected to a secure host, so be sure to share the `https://` link.

### Building

#### `npm run build`

This script will build the static assets for the application in the `build/` directory.

---

## Testing

This application has unit tests (using [Jest](https://jestjs.io/)) and E2E tests (using [Cypress](https://www.cypress.io/)). You can run the tests with the following scripts.

### Unit Tests

#### `npm test`

This will run all unit tests with Jest and output the results to the console.

### E2E Tests

#### `npm run cypress:open`

This will open the Cypress test runner. When it's open, select a test file to run.

Note: These Cypress tests will connect to Twilio rooms, so be sure to have `npm start` running in a separate terminal before running the tests. If you haven't already done so, you will need to add account credentials to the `.env` file.

