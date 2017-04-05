import { reduxActions } from '../../constants'

export default class SubscribePureActions {

    static subscribeRequest(data){
        return {
            type: reduxActions.SUBSCRIBE_REQUEST,
            data
        }
    }

    static subscribeError(data, error) {
        return {
            type: reduxActions.SUBSCRIBE_ERROR,
            data,
            error
        }
    }

    static subscribeSuccess(data) {
        return {
            type: reduxActions.SUBSCRIBE_SUCCESS,
            data
        }
    }
}