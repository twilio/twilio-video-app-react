const THIS = 'get-room-participant-count:';

/*
 * --------------------------------------------------------------------------------
 * returns count of participants in a video room
 *
 * event.roomName - name of video room
 *
 * returns
 * . { count: # } where # is count of 'connected' participants in 'in-progress' video room
 *                      0 if video room is not 'in-progress' or no 'connected' participants
 * --------------------------------------------------------------------------------
 */

// --------------------------------------------------------------------------------
async function getRoomParticipantCount(context, roomName) {
  const client = context.getTwilioClient();

  // get all in-progress rooms by 'roomName
  const r = await client.video.rooms(roomName)
    .fetch()
    .then(r => {
      console.log(`found room ${roomName}: ${r.sid}`);
      return r;
    })
    .catch(r => {
      console.log(`not found room: ${roomName}`);
      return null;
    });

  if (r === null) {
    // roomName room was not found or is not 'in-progress'
    return 0;
  } else {
    // roomName room found, count 'connected' participants
    const participants = await client.video.rooms(roomName).participants.list();
    let n = 0;
    participants.forEach(p => {
      if (p.status === 'connected') {
        console.log(`found connected participant ${p.identity}: ${p.sid}`);
        n += 1;
      }
    });
    console.log(`participant count: ${n}`);
    return n;
  }
}

// --------------------------------------------------------------------------------
exports.handler = async function (context, event, callback) {
  console.time(THIS);
  try {
    const { roomName } = event;

    let participantCount = await getRoomParticipantCount(context, roomName);

    return callback(null, { count: participantCount});
  } catch (err) {
    console.log(err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
};
