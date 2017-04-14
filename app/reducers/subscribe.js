import { reduxActions } from '../constants';
import { objectState } from './initial_states.js';

export function subscribeState(state = objectState, action) {
  switch (action.type) {
    case reduxActions.SUBSCRIBE_REQUEST:
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null
      };

    case reduxActions.SUBSCRIBE_ERROR:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.error,
        message: action.message
      };

    case reduxActions.SUBSCRIBE_SUCCESS:
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.data,
        message: action.message
      };

    default:
      return state;
  }
}
