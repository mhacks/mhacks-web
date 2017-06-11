import { reduxActions } from '../constants';
import { objectState } from './initial_states.js';

export function authState(state = objectState, action) {
    switch (action.type) {
        // Handled separately as we optimistically update
        case reduxActions.LOGOUT_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null,
                data: action.data
            };

        case reduxActions.REGISTER_REQUEST:
        case reduxActions.LOGIN_REQUEST:

            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case reduxActions.REGISTER_ERROR:
        case reduxActions.LOGIN_ERROR:
        case reduxActions.LOGOUT_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case reduxActions.REGISTER_SUCCESS:
        case reduxActions.LOGIN_SUCCESS:
        case reduxActions.LOGOUT_SUCCESS:
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
