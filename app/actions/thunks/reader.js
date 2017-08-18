import { actions } from '../../actions';
import { ReaderRequests } from '../requests';

export default class ReaderThunks {
    static loadApplications() {
        return dispatch => {
            dispatch({ type: actions.LOAD_APPLICATIONS_REQUEST });

            const token = localStorage.getItem('jwt');

            return ReaderRequests.loadApplications(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { applications } = json;
                        dispatch({
                            type: actions.LOAD_APPLICATIONS_SUCCESS,
                            data: applications,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_APPLICATIONS_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static reviewApplications(users, formData) {
        return dispatch => {
            const review = {
                users,
                ...formData
            };

            dispatch({
                type: actions.REVIEW_APPLICATIONS_REQUEST,
                data: review
            });

            const token = localStorage.getItem('jwt');

            return ReaderRequests.reviewApplications(
                token,
                review
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.REVIEW_APPLICATIONS_SUCCESS,
                            data: review,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.REVIEW_APPLICATIONS_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static loadForm(subform) {
        return dispatch => {
            dispatch({
                type: actions.LOAD_READER_FORM_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return ReaderRequests.loadForm(token, subform).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_READER_FORM_SUCCESS,
                            data: {
                                form: json.form,
                                FieldTypes: json.types,
                                form_name: subform
                            },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_READER_FORM_ERROR,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
