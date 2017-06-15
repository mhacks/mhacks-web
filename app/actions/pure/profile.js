import { reduxActions } from '../../constants';

export default class ProfilePureActions {
    static loadProfileRequest(data) {
        return {
            type: reduxActions.LOAD_PROFILE_REQUEST,
            data
        };
    }

    static loadProfileError(data, error, message) {
        return {
            type: reduxActions.LOAD_PROFILE_ERROR,
            data,
            error,
            message
        };
    }

    static loadProfileSuccess(data, message) {
        return {
            type: reduxActions.LOAD_PROFILE_SUCCESS,
            data,
            message
        };
    }

    static updateProfileRequest(data) {
        return {
            type: reduxActions.UPDATE_PROFILE_REQUEST,
            data
        };
    }

    static updateProfileError(data, error, message) {
        return {
            type: reduxActions.UPDATE_PROFILE_ERROR,
            error,
            message
        };
    }

    static updateProfileSuccess(data, message) {
        return {
            type: reduxActions.UPDATE_PROFILE_SUCCESS,
            data,
            message
        };
    }

    static sendVerificationEmailRequest(data) {
        return {
            type: reduxActions.SEND_VERIFICATION_REQUEST,
            data
        };
    }

    static sendVerificationEmailError(error, message) {
        return {
            type: reduxActions.SEND_VERIFICATION_ERROR,
            error,
            message
        };
    }

    static sendVerificationEmailSuccess(data, message) {
        return {
            type: reduxActions.SEND_VERIFICATION_SUCCESS,
            data,
            message
        };
    }
}
