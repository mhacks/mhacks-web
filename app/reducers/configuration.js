import { reduxActions } from '../constants';

const initialState = {
    fetching: false,
    fetched: false,
    error: null,
    message: null,
    is_livepage_enabled: false,
    is_applications_open: false
}

export function configurationState(state = initialState, action) {
    switch (action.type) {
        case reduxActions.LOAD_CONFIGURATION_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case reduxActions.LOAD_CONFIGURATION_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case reduxActions.LOAD_CONFIGURATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                message: action.message,
                ...action.data.configuration
            };

        default:
            return state;
    }
}
