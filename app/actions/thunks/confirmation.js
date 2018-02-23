import { actions } from '../../actions';
import { ConfirmationRequests } from '../requests';

export default class ConfirmationThunks {
    static loadConfirmation() {
        return dispatch => {
            dispatch({ type: actions.LOAD_CONFIRMATION_REQUEST });

            const token = localStorage.getItem('jwt');

            return ConfirmationRequests.loadConfirmation(token).then(
                response => {
                    if (response.status == 200) {
                        response.json().then(json => {
                            dispatch({
                                type: actions.LOAD_CONFIRMATION_SUCCESS,
                                data: { confirmation: json.confirmation },
                                message: json.message
                            });
                        });
                    } else {
                        response.json().then(json => {
                            dispatch({
                                type: actions.LOAD_CONFIRMATION_ERROR,
                                data: token,
                                error: response.status,
                                message: json.message
                            });
                        });
                    }
                }
            );
        };
    }

    static uploadConfirmation(formData) {
        return dispatch => {
            dispatch({
                type: actions.UPLOAD_CONFIRMATION_REQUEST,
                data: formData
            });

            const token = localStorage.getItem('jwt');

            return ConfirmationRequests.uploadConfirmation(
                token,
                formData
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_CONFIRMATION_SUCCESS,
                            data: { confirmation: json.confirmation },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_CONFIRMATION_ERROR,
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
                type: actions.LOAD_CONFIRMATION_FORM_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return ConfirmationRequests.loadForm(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_CONFIRMATION_FORM_SUCCESS,
                            data: { form: json.form, FieldTypes: json.types },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_CONFIRMATION_FORM_ERROR,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
