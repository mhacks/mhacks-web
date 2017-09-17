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
                        const obj = {};

                        json.models.forEach(model => {
                            obj[model] = {
                                documents: []
                            };
                        });

                        dispatch({
                            type: actions.ADMIN_LOAD_MODELS_SUCCESS,
                            data: obj
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

    static loadModel(model) {
        return dispatch => {
            dispatch({
                type: actions.ADMIN_LOAD_MODEL_REQUEST
            });

            getResponseFromRoute(
                endpoints.ADMIN_MODELS + '/' + model
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_LOAD_MODEL_SUCCESS,
                            data: {
                                [model]: {
                                    documents: json.documents
                                }
                            }
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_LOAD_MODEL_FAILURE,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
