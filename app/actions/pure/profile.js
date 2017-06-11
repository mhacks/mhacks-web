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
}
