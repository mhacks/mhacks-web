import { actions } from '../actions';

const initialState = {
    fetching: false,
    fetched: false,
    error: null,
    message: null,
    is_livepage_enabled: false,
    is_applications_open: false,
    data: {}
};

export function configurationState(state = initialState, action) {
    switch (action.type) {
        case actions.LOAD_CONFIGURATION_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.LOAD_CONFIGURATION_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.LOAD_CONFIGURATION_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                message: action.message,
                ...action.data.configuration
            };

            case actions.LOAD_CONFIGURATION_FORM_SUCCESS:

                return {
                    ...state,
                    data: {
                        ...state.data,
                        form: action.data.form,
                        FieldTypes: action.data.FieldTypes
                    },
                    message: action.message
                };

            case actions.UPDATE_CONFIGURATION_SUCCESS:

                return {
                    ...state,
                    fetching: false,
                    fetched: true,
                    message: action.message,
                    ...action.data
                };

        default:
            return state;
    }
}
