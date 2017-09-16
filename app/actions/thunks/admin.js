import { actions } from '../../actions';
import { endpoints } from '../../constants';
import { getResponseFromRoute } from '../../util/actions.js';

export default class AdminThunks {
    static loadModels() {
        return dispatch => {
            dispatch({
                type: actions.ADMIN_LOAD_MODELS_REQUEST
            });

            getResponseFromRoute(endpoints.ADMIN_MODELS).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_LOAD_MODELS_SUCCESS,
                            data: json.models
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_LOAD_MODELS_FAILURE,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
