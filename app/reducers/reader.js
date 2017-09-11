import { actions } from '../actions';

const initialState = {
    fetching: false,
    fetched: false,
    error: null,
    data: {
        applications: []
    }
};

export function readerState(state = initialState, action) {
    switch (action.type) {
        case actions.LOAD_HACKER_APPLICATIONS_REQUEST:
        case actions.LOAD_MENTOR_APPLICATIONS_REQUEST:
        case actions.LOAD_SPEAKER_APPLICATIONS_REQUEST:
        case actions.LOAD_SPONSOR_PORTAL_APPLICATIONS_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.LOAD_HACKER_APPLICATIONS_ERROR:
        case actions.LOAD_MENTOR_APPLICATIONS_ERROR:
        case actions.LOAD_SPEAKER_APPLICATIONS_ERROR:
        case actions.LOAD_SPONSOR_PORTAL_APPLICATIONS_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.LOAD_HACKER_APPLICATIONS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    applications: action.data
                },
                message: action.message
            };

        case actions.LOAD_MENTOR_APPLICATIONS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    mentorApplications: action.data
                },
                message: action.message
            };

        case actions.LOAD_SPEAKER_APPLICATIONS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    speakerApplications: action.data
                },
                message: action.message
            };

        case actions.LOAD_SPONSOR_PORTAL_APPLICATIONS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    sponsorPortalApplications: action.data
                },
                message: action.message
            };

        case actions.REVIEW_APPLICATIONS_SUCCESS: {
            const { reimbursement, score, status } = action.data;
            return {
                ...state,
                data: {
                    ...state.data,
                    applications: state.data.applications.map(application => {
                        if (
                            action.data.users.indexOf(application.email) === -1
                        ) {
                            return application;
                        }
                        return {
                            ...application,
                            reimbursement,
                            score,
                            status
                        };
                    })
                }
            };
        }

        case actions.LOAD_READER_FORM_SUCCESS:
            var form = state.data.form || {};
            form[action.data.form_name] = action.data.form;

            return {
                ...state,
                data: {
                    ...state.data,
                    form,
                    FieldTypes: action.data.FieldTypes
                },
                message: action.message
            };

        default:
            return state;
    }
}
