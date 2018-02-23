import { actions } from '../../actions';
import { ProfileRequests } from '../requests';

export default class ProfileThunks {
    static loadProfile() {
        return dispatch => {
            dispatch({ type: actions.LOAD_PROFILE_REQUEST });

            const token = localStorage.getItem('jwt');

            return ProfileRequests.loadProfile(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { user } = json;

                        const state = {
                            isEmailVerified: user.email_verified,
                            isApplicationSubmitted: user.application_submitted,
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
                                groups: user.groups,
                                avatars: user.avatar,
                                isResumeUploaded: user.resume_uploaded,
                                isConfirmed: user.is_confirmed,
                                ...user
                            }
                        };

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

    static updateProfile(profile, files) {
        return dispatch => {
            dispatch({
                type: actions.UPDATE_PROFILE_REQUEST,
                data: profile
            });

            const token = localStorage.getItem('jwt');

            return ProfileRequests.updateProfile(token, profile, files).then(
                response => {
                    if (response.status == 200) {
                        response.json().then(json => {
                            dispatch({
                                type: actions.UPDATE_PROFILE_SUCCESS,
                                data: { user: profile },
                                message: json.message
                            });
                        });
                    } else {
                        response.json().then(json => {
                            dispatch({
                                type: actions.UPDATE_PROFILE_ERROR,
                                error: response.status,
                                message: json.message
                            });
                        });
                    }
                }
            );
        };
    }

    static sendVerificationEmail(email) {
        return dispatch => {
            dispatch({
                type: actions.SEND_VERIFICATION_REQUEST,
                data: email
            });

            const token = localStorage.getItem('jwt');

            return ProfileRequests.sendVerificationEmail(token, email).then(
                response => {
                    if (response.status == 200) {
                        response.json().then(json => {
                            dispatch({
                                type: actions.SEND_VERIFICATION_SUCCESS,
                                data: email,
                                message: json.message
                            });
                        });
                    } else {
                        response.json().then(json => {
                            dispatch({
                                type: actions.SEND_VERIFICATION_ERROR,
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
                type: actions.LOAD_PROFILE_FORM_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return ProfileRequests.loadForm(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_PROFILE_FORM_SUCCESS,
                            data: { form: json.form, FieldTypes: json.types },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_PROFILE_FORM_ERROR,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
