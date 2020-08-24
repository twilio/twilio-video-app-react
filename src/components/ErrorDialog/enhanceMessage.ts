import { EROOR_MESSAGE } from '../../utils/displayStrings';
// This function is used to provide error messages to the user that are
// different than the error messages provided by the SDK.
export default function enhanceMessage(message = '', code?: number) {
  switch (code) {
    case 20101: // Invalid token error
      return message + EROOR_MESSAGE.INVALIDE_CREDENTIALS;
    default:
      return message;
  }
}
