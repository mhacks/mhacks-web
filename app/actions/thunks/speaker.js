import { actions } from '../../actions';
import { SpeakerRequests } from '../requests';

export default class SpeakerThunks {
    static loadApplication() {
        return dispatch => {
            dispatch({ type: actions.LOAD_SPEAKER_APPLICATION_REQUEST });

            return SpeakerRequests.loadApplication().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_SPEAKER_APPLICATION_SUCCESS,
                            data: {
                                speaker_application: json.speaker_application
                            },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_SPEAKER_APPLICATION_ERROR,
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
                type: actions.UPLOAD_SPEAKER_APPLICATION_REQUEST,
                data: formData
            });

            const token = localStorage.getItem('jwt');

            return SpeakerRequests.uploadApplication(
                token,
                formData,
                files
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_SPEAKER_APPLICATION_SUCCESS,
                            data: { confirmation: json.confirmation },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_SPEAKER_APPLICATION_ERROR,
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
                type: actions.LOAD_SPEAKER_APPLICATION_FORM_REQUEST
            });

            return SpeakerRequests.loadForm().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_SPEAKER_APPLICATION_FORM_SUCCESS,
                            data: { form: json.form, FieldTypes: json.types },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_SPEAKER_APPLICATION_FORM_ERROR,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
