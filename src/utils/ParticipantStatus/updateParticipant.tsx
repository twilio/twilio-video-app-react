export default function updateParticipant(appointmentID: string, participantID: string, status: string, error?: string) {
  if (appointmentID) {
    $.ajax(`/appointments/${appointmentID}/participants/${participantID}`, {
      type: 'PATCH',
      data: {
        participant: {
          status: status,
          room_error: `${status == 'failed' ? error.name + ', ' + error.message : '' }`
        }
      }
    });
  }
}
