import { reduxActions } from '../constants';
import { objectState } from './initial_states.js';

export function userState(state = objectState, action) {
    switch (action.type) {
        case reduxActions.LOAD_PROFILE_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case reduxActions.LOAD_PROFILE_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case reduxActions.LOAD_PROFILE_SUCCESS:
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
