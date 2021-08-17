exports.handler = function (context, event, callback) {

    // send-third-party-message
    // Generate and send six digit MFA code to administrator's phone
    const twilioClient = context.getTwilioClient();
    twilioClient.messages
      .create({
        // to: context.ADMINISTRATOR_PHONE,
        // from: context.TWILIO_PHONE_NUMBER,
        to: event.phoneNumber,
        from: context.TWILIO_FROM_PHONE,
        body: `${event.patient} has invited you to join their health visit at ${event.visitUrl}`,
      })
      .then(function () {
        // SMS was sent successfully
        return callback(null,"Sent");
      })
      .catch(function (err) {
        // if there is any problem in sending SMS

        return callback(err);
      });

};
