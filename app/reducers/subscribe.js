import { actions } from '../actions';
import { objectState } from './initial_states.js';

export function subscribeState(state = objectState, action) {
    switch (action.type) {
        case actions.SUBSCRIBE_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.SUBSCRIBE_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.SUBSCRIBE_SUCCESS:
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
