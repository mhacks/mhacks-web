import { reduxActions } from '../../constants';

export default class ApplicationPureActions {
    static uploadApplicationRequest(data) {
        return {
            type: reduxActions.UPLOAD_APPLICATION_REQUEST,
            data
        };
    }

    static uploadApplicationError(data, error, message) {
        return {
            type: reduxActions.UPLOAD_APPLICATION_ERROR,
            error,
            message
        };
    }

    static uploadApplicationSuccess(data, message) {
        return {
            type: reduxActions.UPLOAD_APPLICATION_SUCCESS,
            data,
            message
        };
    }

    static loadApplicationRequest(data) {
        return {
            type: reduxActions.LOAD_PROFILE_REQUEST,
            data
        };
    }

    static loadApplicationError(data, error, message) {
        return {
            type: reduxActions.LOAD_PROFILE_ERROR,
            data,
            error,
            message
        };
    }

    static loadApplicationSuccess(data, message) {
        return {
            type: reduxActions.LOAD_PROFILE_SUCCESS,
            data,
            message
        };
    }
}
