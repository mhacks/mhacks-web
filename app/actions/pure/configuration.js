import { reduxActions } from '../../constants';

export default class ConfigurationPureActions {
    static loadConfigurationRequest(data) {
        return {
            type: reduxActions.LOAD_CONFIGURATION_REQUEST,
            data
        };
    }

    static loadConfigurationError(data, error, message) {
        return {
            type: reduxActions.LOAD_CONFIGURATION_ERROR,
            data,
            error,
            message
        };
    }

    static loadConfigurationSuccess(data, message) {
        return {
            type: reduxActions.LOAD_CONFIGURATION_SUCCESS,
            data,
            message
        };
    }
}
