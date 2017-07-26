import { reduxActions } from '../constants';

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
        case reduxActions.LOAD_APPLICATIONS_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case reduxActions.LOAD_APPLICATIONS_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case reduxActions.LOAD_APPLICATIONS_SUCCESS:
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

        case reduxActions.REVIEW_APPLICATIONS_SUCCESS: {
            const {
                reimbursement,
                score,
                status
            } = action.data;
            return {
                ...state,
                data: {
                    ...state.data,
                    applications: state.data.applications.map((application) => {
                        if (action.data.users.indexOf(application.user) === -1) {
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

        default:
            return state;
    }
}
