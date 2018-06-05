import { actions } from '../actions';

const initialState = {
    models: {},
    fetching: false,
    fetched: false,
    error: null
};

export function adminState(state = initialState, action) {
    switch (action.type) {
        case actions.ADMIN_LOAD_MODELS_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.ADMIN_LOAD_MODELS_FAILURE:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.ADMIN_LOAD_MODELS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                models: action.data,
                message: action.message
            };

        case actions.ADMIN_LOAD_MODEL_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                models: {
                    ...state.models,
                    ...action.data
                },
                message: action.message
            };

        case actions.ADMIN_LOAD_DOCUMENT_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                document: action.data,
                message: action.message
            };

        case actions.ADMIN_LOAD_DOCUMENT_REQUEST:
            return {
                ...state,
                fetching: false,
                fetched: true,
                models: {
                    ...state.models,
                    ...action.data
                },
                message: action.message
            };

        case actions.ADMIN_LOAD_FORM_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                form: action.data,
                message: action.message
            };

        case actions.ADMIN_LOAD_FORM_REQUEST:
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
        default:
            return state;
    }
}
