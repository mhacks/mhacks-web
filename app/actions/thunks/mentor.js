import { actions } from '../../actions';
import { MentorRequests } from '../requests';

export default class MentorThunks {
    static loadApplication() {
        return dispatch => {
            dispatch({ type: actions.LOAD_MENTOR_APPLICATION_REQUEST });

            return MentorRequests.loadApplication().then(response => {
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
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static uploadApplication(formData, files) {
        return dispatch => {
            dispatch({
                type: actions.UPLOAD_MENTOR_APPLICATION_REQUEST,
                data: formData
            });

            const token = localStorage.getItem('jwt');

            return MentorRequests.uploadApplication(
                token,
                formData,
                files
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

            return MentorRequests.loadForm().then(response => {
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
