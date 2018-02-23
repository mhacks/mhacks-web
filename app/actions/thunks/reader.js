import { actions } from '../../actions';
import { ReaderRequests } from '../requests';
import { loadFormRequest } from '../../util/actions';

export default class ReaderThunks {
    static loadHackerApplications() {
        return dispatch => {
            dispatch({ type: actions.LOAD_HACKER_APPLICATIONS_REQUEST });

            return ReaderRequests.loadHackerApplications().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { applications } = json;
                        dispatch({
                            type: actions.LOAD_HACKER_APPLICATIONS_SUCCESS,
                            data: applications,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_HACKER_APPLICATIONS_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static loadSponsorPortalApplications() {
        return dispatch => {
            dispatch({
                type: actions.LOAD_SPONSOR_PORTAL_APPLICATIONS_REQUEST
            });

            return ReaderRequests.loadSponsorPortalApplications().then(
                response => {
                    if (response.status == 200) {
                        response.json().then(json => {
                            const { applications } = json;
                            dispatch({
                                type:
                                    actions.LOAD_SPONSOR_PORTAL_APPLICATIONS_SUCCESS,
                                data: applications,
                                message: json.message
                            });
                        });
                    } else {
                        response.json().then(json => {
                            dispatch({
                                type:
                                    actions.LOAD_SPONSOR_PORTAL_APPLICATIONS_ERROR,
                                error: response.status,
                                message: json.message
                            });
                        });
                    }
                }
            );
        };
    }

    static loadMentorApplications() {
        return dispatch => {
            dispatch({ type: actions.LOAD_MENTOR_APPLICATIONS_REQUEST });

            return ReaderRequests.loadMentorApplications().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { applications } = json;
                        dispatch({
                            type: actions.LOAD_MENTOR_APPLICATIONS_SUCCESS,
                            data: applications,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_MENTOR_APPLICATIONS_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static loadSpeakerApplications() {
        return dispatch => {
            dispatch({ type: actions.LOAD_SPEAKER_APPLICATIONS_REQUEST });

            return ReaderRequests.loadSpeakerApplications().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { applications } = json;
                        dispatch({
                            type: actions.LOAD_SPEAKER_APPLICATIONS_SUCCESS,
                            data: applications,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_SPEAKER_APPLICATIONS_ERROR,
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

            return ReaderRequests.reviewApplications(token, review).then(
                response => {
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
                }
            );
        };
    }

    static loadForm(base, subform) {
        return dispatch => {
            dispatch({
                type: actions.LOAD_READER_FORM_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return loadFormRequest(token, base + subform).then(response => {
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
