# twilio-video-app-react

[![CircleCI](https://circleci.com/gh/twilio/twilio-video-app-react.svg?style=svg&circle-token=9d6b1e89d148181aaa6874c29849c730b8ca406d)](https://circleci.com/gh/twilio/twilio-video-app-react)

This is a video collaboration application built with the [twilio-video.js SDK](https://github.com/twilio/twilio-video.js) and [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

Run `npm install` to install all dependencies.

In order to run the local token server (which is required to connect to a room), you will need to create an account in the [Twilio Console](https://www.twilio.com/console). After you log in to the console, click on 'Settings' and find your Account SID.

Next, you'll need to create an API Key and Secret. You can do this in the [API Keys Section](https://www.twilio.com/console/video/project/api-keys) under Programmable Video Tools in the Twilio Console.

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

`curl http://localhost:8080/token -H "Content-Type: application/json" -d '{"name": "My Name", "room": "My Room"}'`

### Multiple Participants in a Room

If you want to see how the application behaves with multiple participants, you can simply open `localhost:3000` in multiple tabs in your browser and connect to the same room using different user names.

Or, if you'd like to invite real people to join a room, you can use the free tool [ngrok](https://ngrok.com/). Once ngrok is set up, run `npm start` and then use the following command to create a shareable link:

`./ngrok http --host-header=rewrite 3000`

Note: The browser will only allow you use audio and video when connected to a secure host, so be sure to share the `https://` link.

### Building

#### `npm run build`

This script will build the static assets for the application in the `build/` directory.

## Testing

This application has unit tests (using [Jest](https://jestjs.io/)) and E2E tests (using [Cypress](https://www.cypress.io/)). You can run the tests with the following scripts.

### Unit Tests

#### `npm test`

This will run all unit tests with Jest and output the results to the console.

### E2E Tests

#### `npm run cypress:open`

This will open the Cypress test runner. When it's open, select a test file to run.

Note: These Cypress tests will connect to Twilio rooms, so be sure to have `npm start` running in a separate terminal before running the tests. If you haven't already done so, you will need to add account credentials to the `.env` file.

## Configuration

The `connect` function from the SDK accepts a [configuration object](https://media.twiliocdn.com/sdk/js/video/releases/2.0.0-beta16/docs/global.html#ConnectOptions). The configuration object for this application can be found in [src/index.ts](https://github.com/twilio/twilio-video-app-react/blob/AHOYAPPS-30-readme/src/index.tsx#L19). In this object, we 1) enable dominant speaker detection, 2) enable the network quality API, and 3) supply various options to configure the [bandwidth profile](https://www.twilio.com/docs/video/tutorials/using-bandwidth-profile-api).

This application dynamically changes the priority of certain remote video tracks in order to provide a good user experience. Any video track that will be displayed in the main video area will have `track.setPriority('high')` called on it (see the [VideoTrack](https://github.com/twilio/twilio-video-app-react/blob/AHOYAPPS-30-readme/src/components/VideoTrack/VideoTrack.tsx#L24) component) when the component is mounted. This higher priority enables the track to be rendered at a high resolution. `track.setPriority(null)` is called when the component is unmounted so that the track's priority is set to its default. 

## Application Architecture

This state of this application (with a few exceptions) is managed by the [room object](https://media.twiliocdn.com/sdk/js/video/releases/2.0.0-beta16/docs/Room.html) that is supplied by the SDK. The `room` object contains all information about the room that the user is connected to. The class hierarchy of the `room` object can be viewed [here](https://www.twilio.com/docs/video/migrating-1x-2x#object-model).

One great way to learn about the room object is to explore it in the browser console. When you are connected to a room, the application will expose the room object as a window variable: `window.twilioRoom`.

Since the `room` object maintains all state that relates to the connected room, it isn't necessary to use a tool like Redux to track the state of the room. We can instead use the `room` object as our source of truth. One caveat is that we will need some way of triggering component re-renders in React. The `room` object and most child properties are [event emitters](https://nodejs.org/api/events.html#events_class_eventemitter), which means that we can subscribe to these events to update React components as the room state changes. 

[React hooks](https://reactjs.org/docs/hooks-intro.html) can be used to subscribe to events and trigger component re-renders. This application frequently uses the `useState` and `useEffect` hooks to subscribe to changes in room state. Here is a simple example:

```
import { useEffect, useState } from 'react';

export default function useDominantSpeaker(room) {
  const [dominantSpeaker, setDominantSpeaker] = useState(room.dominantSpeaker);

  useEffect(() => {
    room.on('dominantSpeakerChanged', setDominantSpeaker);
    return () => {
      room.off('dominantSpeakerChanged', setDominantSpeaker);
    };
  }, [room]);

  return dominantSpeaker;
}

```

In this hook, the `useEffect` hook is used to subscribe to the `domainantSpeakerChanged` event emitted by the `room` object. When this event is emitted, the `setDominantSpeaker` function is called which will update the `domainantSpeaker` variable and trigger a re-render of any components that are consuming this hook.  

For more information on how React hooks can be used with the Twilio Video SDK, see this tutorial: https://www.twilio.com/blog/video-chat-react-hooks.
