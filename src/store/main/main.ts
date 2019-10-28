import { State, ActionTypes, RECEIVE_TOKEN } from './types';
import { ThunkAction } from 'redux-thunk';

type ThunkResult<R> = ThunkAction<R, State, undefined, ActionTypes>;

const initialState: State = {
  token: '',
};

export function receiveToken(token: string): ActionTypes {
  return {
    type: RECEIVE_TOKEN,
    payload: token,
  };
}

export function getToken(
  name: string,
  room: string
): ThunkResult<Promise<ActionTypes>> {
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

export default function appReducer(
  state = initialState,
  action: ActionTypes
): State {
  switch (action.type) {
    case RECEIVE_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
}
