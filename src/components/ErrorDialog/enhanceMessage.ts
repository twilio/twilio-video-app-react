import notAllowedMessages from './ErrorMessages/notAllowedMessages'

// This function is used to provide error messages to the user that are
// different than the error messages provided by the SDK.
export default function enhanceMessage(message = '', name?: string) {
  switch (name) {
    case "NotAllowedError":
      return notAllowedMessages();
    case "NotFoundError":
      return "Tu dispositivo debe tener cámara y micrófono conectados funcionando para tomar esta videollamada";
    case "NotReadableError":
      return "Otra aplicación esta usando tu cámara o micrófono. Prueba cerrando todas las aplicaciones o por ultimo reiniciando tu dispositivo";
    case "AbortError":
      return "Otra aplicación esta usando tu cámara o micrófono. Prueba cerrando todas las aplicaciones o por ultimo reiniciando tu dispositivo";
    case "OverconstrainedError":
      return "Cámara o micrófono no está conectado al dispositivo. Prueba conectandola de nuevo y refresca el navegador.";
    case "TypeError":
      return "Debes entrar a la pagina por medio de conexion segura HTTPS";
    case "TwilioError":
      return "Error al unirse a la sala. Comprueba tu conexión a internet e intentalo nuevamente"
    case "SignalingServerBusyError":
        return "Error al unirse a la sala. Comprueba tu conexión a internet e intentalo nuevamente"
    case "RoomMaxParticipantsExceededError":
        return "Error al unirse a la sala. La sala esta llena"
    case "RoomNotFoundError":
        return "Error al unirse a la sala. Sala no encontrada"
    case "MediaConnectionError":
        return "Error al unirse a la sala. Comprueba tu conexión a internet e intentalo nuevamente. Si estas detras de un firewall debes permitir el trafico desde twilio.com"
    default:
      return message;
  }
}
