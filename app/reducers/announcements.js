import { reduxActions } from '../constants';
import { arrayState } from './initial_states.js';

export function announcementsState(state = arrayState, action) {
    switch (action.type) {
        case reduxActions.LOAD_ANNOUNCEMENTS_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case reduxActions.LOAD_ANNOUNCEMENTS_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case reduxActions.LOAD_ANNOUNCEMENTS_SUCCESS:
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
