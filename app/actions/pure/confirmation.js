import { reduxActions } from '../../constants';

export default class ConfirmationPureActions {
    static uploadConfirmationRequest(data) {
        return {
            type: reduxActions.UPLOAD_CONFIRMATION_REQUEST,
            data
        };
    }

    static uploadConfirmationError(data, error, message) {
        return {
            type: reduxActions.UPLOAD_CONFIRMATION_ERROR,
            error,
            message
        };
    }

    static uploadConfirmationSuccess(data, message) {
        return {
            type: reduxActions.UPLOAD_CONFIRMATION_SUCCESS,
            data,
            message
        };
    }

    static loadConfirmationRequest(data) {
        return {
            type: reduxActions.LOAD_CONFIRMATION_REQUEST,
            data
        };
    }

    static loadConfirmationError(data, error, message) {
        return {
            type: reduxActions.LOAD_CONFIRMATION_ERROR,
            data,
            error,
            message
        };
    }

    static loadConfirmationSuccess(data, message) {
        return {
            type: reduxActions.LOAD_CONFIRMATION_SUCCESS,
            data,
            message
        };
    }
}
