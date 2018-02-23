import { actions } from '../../actions';
import { ConfigurationRequests } from '../requests';
import { ProfileFields } from '../../constants/forms';

export default class ConfigurationThunks {
    static loadConfiguration() {
        return dispatch => {
            dispatch({ type: actions.LOAD_CONFIGURATION_REQUEST });

            const token = localStorage.getItem('jwt');

            return ConfigurationRequests.loadConfiguration(token).then(
                response => {
                    if (response.status == 200) {
                        response.json().then(json => {
                            const { user, configuration } = json;

                            const state = {
                                configuration
                            };

                            if (user) {
                                state.userData = {
                                    isEmailVerified: user.email_verified,
                                    isApplicationSubmitted:
                                        user.application_submitted,
                                    isLoggedIn: true,
                                    isAdmin:
                                        user.groups &&
                                        user.groups.indexOf('admin') !== -1,
                                    isReader:
                                        user.groups &&
                                        user.groups.indexOf('reader') !== -1,
                                    isSponsor:
                                        user.groups &&
                                        user.groups.indexOf('sponsor') !== -1,
                                    user: {
                                        name: user.full_name,
                                        avatars: user.avatar,
                                        isResumeUploaded: user.resume_uploaded,
                                        isConfirmed: user.is_confirmed,
                                        ...user
                                    }
                                };

                                for (const key of Object.keys(ProfileFields)) {
                                    if (user.hasOwnProperty(key)) {
                                        state.userData.user[key] = user[key];
                                    }
                                }
                            }

                            dispatch({
                                type: actions.LOAD_CONFIGURATION_SUCCESS,
                                data: state,
                                message: json.message
                            });
                        });
                    } else {
                        response.json().then(json => {
                            dispatch({
                                type: actions.LOAD_CONFIGURATION_ERROR,
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

    static loadForm() {
        return dispatch => {
            dispatch({
                type: actions.LOAD_CONFIGURATION_FORM_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return ConfigurationRequests.loadForm(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_CONFIGURATION_FORM_SUCCESS,
                            data: { form: json.form, FieldTypes: json.types },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_CONFIGURATION_FORM_ERROR,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static updateConfig(formData) {
        return dispatch => {
            dispatch({
                type: actions.UPDATE_CONFIGURATION_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return ConfigurationRequests.updateConfiguration(
                token,
                formData
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPDATE_CONFIGURATION_SUCCESS,
                            data: formData,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPDATE_CONFIGURATION_ERROR,
                            data: formData,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
