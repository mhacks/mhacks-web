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
}
