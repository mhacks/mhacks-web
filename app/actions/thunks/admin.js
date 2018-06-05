import { actions } from '../../actions';
import { endpoints } from '../../constants';
import {
    getResponseFromRoute,
    postFormResponseFromRoute
} from '../../util/actions.js';

export default class AdminThunks {
    static loadModels() {
        return dispatch => {
            dispatch({
                type: actions.ADMIN_LOAD_MODELS_REQUEST
            });

            getResponseFromRoute(endpoints.ADMIN_MODELS).then(response => {
                if (response.status === 200) {
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

            getResponseFromRoute(endpoints.ADMIN_MODELS + '/' + model).then(
                response => {
                    if (response.status === 200) {
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
                }
            );
        };
    }

    static loadDocument(model, id) {
        return dispatch => {
            dispatch({
                type: actions.ADMIN_LOAD_DOCUMENT_REQUEST
            });

            getResponseFromRoute(
                endpoints.ADMIN_MODELS + '/' + model + '/' + id
            ).then(response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_LOAD_DOCUMENT_SUCCESS,
                            data: json.document
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_LOAD_DOCUMENT_FAILURE,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static loadForm(model) {
        return dispatch => {
            dispatch({
                type: actions.ADMIN_LOAD_FORM_REQUEST
            });

            getResponseFromRoute(
                endpoints.FORM + '/' + model.slice(0, -1)
            ).then(response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_LOAD_FORM_SUCCESS,
                            data: { form: json.form, FieldTypes: json.types },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_LOAD_FORM_FAILURE,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static updateModel(model, id, data, files) {
        return dispatch => {
            dispatch({
                type: actions.ADMIN_UPDATE_DOCUMENT_REQUEST
            });

            postFormResponseFromRoute(
                endpoints.ADMIN_MODELS + '/' + model + '/' + id,
                data,
                files
            ).then(response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_UPDATE_DOCUMENT_SUCCESS,
                            data: {},
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ADMIN_UPDATE_DOCUMENT_FAILURE,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
