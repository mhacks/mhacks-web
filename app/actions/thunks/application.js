import { actions } from '../../actions';
import { ApplicationRequests } from '../requests';

export default class ApplicationThunks {
    static loadApplication() {
        return dispatch => {
            dispatch({ type: actions.LOAD_PROFILE_REQUEST });
            const token = localStorage.getItem('jwt');

            return ApplicationRequests.loadApplication(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { application } = json;
                        const state = { app: application };

                        dispatch({
                            type: actions.LOAD_PROFILE_SUCCESS,
                            data: state,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_PROFILE_ERROR,
                            data: token,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static uploadApplication(application, files) {
        return dispatch => {
            dispatch({
                type: actions.UPLOAD_APPLICATION_REQUEST,
                data: application
            });

            const token = localStorage.getItem('jwt');

            return ApplicationRequests.uploadApplication(
                token,
                application,
                files
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_APPLICATION_SUCCESS,
                            data: {
                                isApplicationSubmitted: true,
                                app: json.app
                            },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_APPLICATION_ERROR,
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
                type: actions.LOAD_APPLICATIONS_FORM_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return ApplicationRequests.loadForm(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_APPLICATIONS_FORM_SUCCESS,
                            data: { form: json.form, FieldTypes: json.types },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_APPLICATIONS_FORM_ERROR,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
