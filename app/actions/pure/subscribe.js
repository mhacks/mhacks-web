import { reduxActions } from '../../constants';

export default class SubscribePureActions {
    static subscribeRequest(data) {
        return {
            type: reduxActions.SUBSCRIBE_REQUEST,
            data
        };
    }

    static subscribeError(data, error, message) {
        return {
            type: reduxActions.SUBSCRIBE_ERROR,
            data,
            error,
            message
        };
    }

    static subscribeSuccess(data, message) {
        return {
            type: reduxActions.SUBSCRIBE_SUCCESS,
            data,
            message
        };
    }
}
