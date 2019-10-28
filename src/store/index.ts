import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import {
  useSelector as useSelectorGeneric,
  TypedUseSelectorHook,
} from 'react-redux';
import { State } from './main/types';
import mainReducer from './main/main';

// @ts-ignore __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ does not exist on type Window
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const useSelector: TypedUseSelectorHook<State> = useSelectorGeneric;

const store = createStore(
  mainReducer,
  composeEnhancers(applyMiddleware(ReduxThunk))
);

export default store;
