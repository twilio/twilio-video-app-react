import { ActionTypes, CLEAR_TOKEN, RECEIVE_TOKEN, SET_ERROR, State } from './types';
import { ThunkAction } from 'redux-thunk';
import { TwilioError } from 'twilio-video';

type ThunkResult<R> = ThunkAction<R, State, undefined, ActionTypes>;

const initialState: State = {
  token: '',
  error: null,
};

export function receiveToken(token: string): ActionTypes {
  return {
    type: RECEIVE_TOKEN,
    payload: token,
  };
}

export function clearToken(): ActionTypes {
  return {
    type: CLEAR_TOKEN,
  };
}

export function setError(error: TwilioError): ActionTypes {
  return {
    type: SET_ERROR,
    payload: error,
  };
}

export function dismissError(): ActionTypes {
  return {
    type: SET_ERROR,
    payload: null,
  };
}

export function getToken(name: string, room: string): ThunkResult<Promise<ActionTypes>> {
  return dispatch => {
    return fetch(`/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, room }),
    })
      .then(res => res.json())
      .then(res => dispatch(receiveToken(res.token)));
  };
}

export default function appReducer(state = initialState, action: ActionTypes): State {
  switch (action.type) {
    case RECEIVE_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case CLEAR_TOKEN:
      return {
        ...state,
        token: '',
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
