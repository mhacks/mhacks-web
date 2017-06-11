import { reduxActions } from '../../constants';

export default class AuthPureActions {
    static registerRequest(data) {
        return {
            type: reduxActions.REGISTER_REQUEST,
            data
        };
    }

    static registerError(data, error, message) {
        return {
            type: reduxActions.REGISTER_ERROR,
            data,
            error,
            message
        };
    }

    static registerSuccess(data, message) {
        return {
            type: reduxActions.REGISTER_SUCCESS,
            data,
            message
        };
    }

    static loginRequest(data) {
        return {
            type: reduxActions.LOGIN_REQUEST,
            data
        };
    }

    static loginError(data, error, message) {
        return {
            type: reduxActions.LOGIN_ERROR,
            data,
            error,
            message
        };
    }

    static loginSuccess(data, message) {
        return {
            type: reduxActions.LOGIN_SUCCESS,
            data,
            message
        };
    }

    static logoutRequest() {
        return {
            type: reduxActions.LOGOUT_REQUEST
        };
    }

    static logoutError(error, message) {
        return {
            type: reduxActions.LOGOUT_ERROR,
            error,
            message
        };
    }

    static logoutSuccess(message) {
        return {
            type: reduxActions.LOGOUT_SUCCESS,
            message
        };
    }
}
