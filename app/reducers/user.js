import { reduxActions } from '../constants';
import { initialUserState } from './initial_states.js';

export function userState(state = initialUserState, action) {
    switch (action.type) {
        // Handled separately as we optimistically update
        case reduxActions.LOGOUT_REQUEST:
            return initialUserState;

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
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case reduxActions.REGISTER_SUCCESS:
        case reduxActions.LOGIN_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                },
                message: action.message
            };

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
                data: {
                    ...state.data,
                    ...action.data
                },
                message: action.message
            };

        case reduxActions.UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case reduxActions.UPDATE_PROFILE_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case reduxActions.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    user: {
                        ...action.data.user
                    }
                },
                message: action.message
            };

        case reduxActions.UPLOAD_APPLICATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        default:
            return state;
    }
}
