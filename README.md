# twilio-video-app-react

A collaboration application built with the twilio-video.js SDK and React.js

## Setup

Run `npm install` to install all dependencies.

To run the token server, you will need to create a `.env` file (example below) to store your Twilio credentials.

```
ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Run

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run server`

This will run the token server.

Both `npm start` and `npm run server` will need to be run in order for the applicaiton to function properly.

## Test

### `npm test`

Launches the test runner in the interactive watch mode.

## Build

### `npm run build`

Builds the app for production to the `build` folder.

## Application Architecture

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
