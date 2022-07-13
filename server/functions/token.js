/* global Twilio Runtime */
'use strict';

const axios = require('axios');
const querystring = require('querystring');

const AccessToken = Twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

module.exports.handler = async (context, event, callback) => {
  const { ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, ROOM_TYPE, CONVERSATIONS_SERVICE_SID } = context;

  const authHandler = require(Runtime.getAssets()['/auth-handler.js'].path);
  authHandler(context, event, callback);

  const { user_identity, room_name, create_room = true, create_conversation = false } = event;

  let response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');

  if (typeof create_room !== 'boolean') {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'invalid parameter',
        explanation: 'A boolean value must be provided for the create_room parameter',
      },
    });
    return callback(null, response);
  }

  if (typeof create_conversation !== 'boolean') {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'invalid parameter',
        explanation: 'A boolean value must be provided for the create_conversation parameter',
      },
    });
    return callback(null, response);
  }

  if (!user_identity) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing user_identity',
        explanation: 'The user_identity parameter is missing.',
      },
    });
    return callback(null, response);
  }

  if (!room_name && create_room) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing room_name',
        explanation: 'The room_name parameter is missing. room_name is required when create_room is true.',
      },
    });
    return callback(null, response);
  }

  if (create_room) {
    const client = context.getTwilioClient();

    const region = client.region;

    const axiosClient = axios.create({
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${TWILIO_API_KEY_SID}:${TWILIO_API_KEY_SECRET}`, 'utf8').toString('base64'),
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      baseURL:
        region === 'dev' || region === 'stage'
          ? `https://video.${region}.twilio.com/v1`
          : 'https://video.twilio.com/v1',
    });

    let room;

    try {
      // See if a room already exists
      room = await client.video.rooms(room_name).fetch();
    } catch (e) {
      try {
        // If room doesn't exist, create it
        const roomData = await axiosClient('Rooms', {
          method: 'post',
          data: querystring.stringify({
            UniqueName: room_name,
            Type: 'group',
            LargeRoom: 'true',
            VideoCodecs: 'VP8',
            MediaRegion: region === 'dev' ? 'us2' : 'us1',
            MaxParticipants: 100,
          }),
        });
        room = roomData.data;
        console.log('created room', room);
        // room = await client.video.rooms.create({ uniqueName: room_name, type: ROOM_TYPE });
      } catch (e) {
        console.log(e);
        response.setStatusCode(500);
        response.setBody({
          error: {
            message: 'error creating room',
            explanation: 'Something went wrong when creating a room.',
          },
        });
        return callback(null, response);
      }
    }

    if (create_conversation) {
      const conversationsClient = client.conversations.services(CONVERSATIONS_SERVICE_SID);

      try {
        // See if conversation already exists
        await conversationsClient.conversations(room.sid).fetch();
      } catch (e) {
        try {
          // If conversation doesn't exist, create it.
          // Here we add a timer to close the conversation after the maximum length of a room (24 hours).
          // This helps to clean up old conversations since there is a limit that a single participant
          // can not be added to more than 1,000 open conversations.
          await conversationsClient.conversations.create({ uniqueName: room.sid, 'timers.closed': 'P1D' });
        } catch (e) {
          response.setStatusCode(500);
          response.setBody({
            error: {
              message: 'error creating conversation',
              explanation: 'Something went wrong when creating a conversation.',
            },
          });
          return callback(null, response);
        }
      }

      try {
        // Add participant to conversation
        await conversationsClient.conversations(room.sid).participants.create({ identity: user_identity });
      } catch (e) {
        // Ignore "Participant already exists" error (50433)
        if (e.code !== 50433) {
          response.setStatusCode(500);
          response.setBody({
            error: {
              message: 'error creating conversation participant',
              explanation: 'Something went wrong when creating a conversation participant.',
            },
          });
          return callback(null, response);
        }
      }
    }
  }

  // Create token
  const token = new AccessToken(ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });

  // Add participant's identity to token
  token.identity = user_identity;

  // Add video grant to token
  const videoGrant = new VideoGrant({ room: room_name });
  token.addGrant(videoGrant);

  // Add chat grant to token
  const chatGrant = new ChatGrant({ serviceSid: CONVERSATIONS_SERVICE_SID });
  token.addGrant(chatGrant);

  // Return token
  response.setStatusCode(200);
  response.setBody({ token: token.toJwt(), room_type: ROOM_TYPE });
  return callback(null, response);
};
