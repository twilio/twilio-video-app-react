export default function updateParticipantFailed(appointmentID: string, participantID: string, error?: string) {
  $.ajax(`/appointments/${appointmentID}/participants/${participantID}`, {
    type: 'PATCH',
    data: {
      participant: {
        room_error: `${error.name}, ${error.message}`
      }
    }
  });
}
