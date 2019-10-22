export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';
export const UPDATE_NAME = 'UPDATE_NAME';
export const UPDATE_ROOM = 'UPDATE_ROOM';

export interface State {
  token: string;
}

interface ReceiveTokenAction {
  type: typeof RECEIVE_TOKEN;
  payload: string;
}

export type ActionTypes = ReceiveTokenAction;
