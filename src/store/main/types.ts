import { TwilioError } from 'twilio-video';

export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';
export const CLEAR_TOKEN = 'CLEAR_TOKEN';
export const UPDATE_NAME = 'UPDATE_NAME';
export const UPDATE_ROOM = 'UPDATE_ROOM';
export const SET_ERROR = 'SET_ERROR';
export const DISMISS_ERROR = 'DISMISS_ERROR';

export interface State {
  token: string;
  error: TwilioError | null;
}

interface ReceiveTokenAction {
  type: typeof RECEIVE_TOKEN;
  payload: string;
}

interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: TwilioError | null;
}

interface ClearTokenAction {
  type: typeof CLEAR_TOKEN;
}

export type ActionTypes = ReceiveTokenAction | SetErrorAction | ClearTokenAction;
