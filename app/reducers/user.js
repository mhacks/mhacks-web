import { actions } from '../actions';
import { initialUserState } from './initial_states.js';

export function userState(state = initialUserState, action) {
    switch (action.type) {
        // Handled separately as we optimistically update
        case actions.LOGOUT_REQUEST:
            return initialUserState;

        case actions.REGISTER_REQUEST:
        case actions.LOGIN_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.REGISTER_ERROR:
        case actions.LOGIN_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.REGISTER_SUCCESS:
        case actions.LOGIN_SUCCESS:
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

        case actions.LOAD_PROFILE_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.LOAD_PROFILE_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.LOAD_PROFILE_SUCCESS:
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

        case actions.UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.UPDATE_PROFILE_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    user: {
                        ...state.data.user,
                        ...action.data.user
                    }
                },
                message: action.message
            };

        case actions.UPLOAD_APPLICATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    app: {
                        ...action.data.app
                    }
                }
            };

        case actions.LOAD_CONFIGURATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data.userData
                },
                message: action.message
            };

        case actions.UPLOAD_CONFIRMATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data,
                    user: {
                        ...state.data.user,
                        isConfirmed: true
                    }
                }
            };

        case actions.UPLOAD_CONFIRMATION_FAILED:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data,
                    user: {
                        ...state.data.user,
                        isConfirmed: false
                    }
                }
            };

        case actions.LOAD_CONFIRMATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_CONFIRMATION_FORM_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_CONFIRMATION_FORM_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };
        case actions.LOAD_APPLICATIONS_FORM_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_APPLICATIONS_FORM_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };
        case actions.LOAD_MENTOR_APPLICATION_FORM_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_MENTOR_APPLICATION_FORM_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };
        case actions.LOAD_MENTOR_APPLICATION_FORM_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_MENTOR_APPLICATION_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };
        case actions.LOAD_MENTOR_APPLICATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_MENTOR_APPLICATION_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_SPEAKER_APPLICATION_FORM_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_SPEAKER_APPLICATION_FORM_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };
        case actions.LOAD_SPEAKER_APPLICATION_FORM_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_SPEAKER_APPLICATION_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };
        case actions.LOAD_SPEAKER_APPLICATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_SPEAKER_APPLICATION_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        default:
            return state;
    }
}
