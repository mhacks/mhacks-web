import { actions } from '../../actions';
import { MentorRequests } from '../requests';

export default class MentorThunks {
    static loadApplication() {
        return dispatch => {
            dispatch({ type: actions.LOAD_MENTOR_APPLICATION_REQUEST });

            const token = localStorage.getItem('jwt');

            return MentorRequests.loadApplication(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_MENTOR_APPLICATION_SUCCESS,
                            data: {
                                mentor_application: json.mentor_application
                            },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_MENTOR_APPLICATION_ERROR,
                            data: token,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static uploadApplication(formData) {
        return dispatch => {
            dispatch({
                type: actions.UPLOAD_MENTOR_APPLICATION_REQUEST,
                data: formData
            });

            const token = localStorage.getItem('jwt');

            return MentorRequests.uploadApplication(
                token,
                formData
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_MENTOR_APPLICATION_SUCCESS,
                            data: { confirmation: json.confirmation },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_MENTOR_APPLICATION_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static loadForm() {
        return dispatch => {
            dispatch({
                type: actions.LOAD_MENTOR_APPLICATION_FORM_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return MentorRequests.loadForm(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_MENTOR_APPLICATION_FORM_SUCCESS,
                            data: { form: json.form, FieldTypes: json.types },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_MENTOR_APPLICATION_FORM_ERROR,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
