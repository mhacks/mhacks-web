import { actions } from '../../actions';
import { AuthRequests } from '../requests';

export default class AuthThunks {
    static register(user) {
        return dispatch => {
            dispatch({
                type: actions.REGISTER_REQUEST,
                data: user
            });

            return AuthRequests.register({
                full_name: user.name,
                email: user.email,
                password: user.password
            }).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        localStorage.setItem('jwt', json.token);

                        dispatch({
                            type: actions.REGISTER_SUCCESS,
                            data: {
                                name: user.name,
                                email: user.email,
                                token: json.token,
                                isLoggedIn: true
                            },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.REGISTER_ERROR,
                            data: user.email,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static login(user) {
        return dispatch => {
            dispatch({
                type: actions.LOGIN_REQUEST,
                data: user
            });

            return AuthRequests.login(user).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        localStorage.setItem('jwt', json.token);

                        dispatch({
                            type: actions.LOGIN_SUCCESS,
                            data: {
                                email: user.email,
                                token: json.token,
                                isLoggedIn: true
                            },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOGIN_ERROR,
                            data: user.email,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static logout() {
        return dispatch => {
            dispatch({ type: actions.LOGOUT_REQUEST });

            return AuthRequests.logout().then(response => {
                localStorage.removeItem('jwt');
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOGOUT_SUCCESS,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOGOUT_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
