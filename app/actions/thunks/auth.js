import { AuthPureActions } from '../pure';
import { AuthRequests } from '../requests';

export default class AuthThunks {
    static register(user) {
        return dispatch => {
            dispatch(AuthPureActions.registerRequest(user));

            return AuthRequests.register({
                full_name: user.name,
                email: user.email,
                password: user.password
            }).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            AuthPureActions.registerSuccess(
                                {
                                    name: user.name,
                                    email: user.email,
                                    token: json.token,
                                    isLoggedIn: true
                                },
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            AuthPureActions.registerError(
                                user.email,
                                response.status,
                                json.message
                            )
                        );
                    });
                }
            });
        };
    }

    static login(user) {
        return dispatch => {
            dispatch(AuthPureActions.loginRequest(user));

            return AuthRequests.login(user).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            AuthPureActions.loginSuccess(
                                {
                                    email: user.email,
                                    token: json.token,
                                    isLoggedIn: true
                                },
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            AuthPureActions.loginError(
                                user.email,
                                response.status,
                                json.message
                            )
                        );
                    });
                }
            });
        };
    }

    static logout() {
        return dispatch => {
            dispatch(AuthPureActions.logoutRequest());

            return AuthRequests.logout().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(AuthPureActions.logoutSuccess(json.message));
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            AuthPureActions.logoutError(
                                response.status,
                                json.message
                            )
                        );
                    });
                }
            });
        };
    }
}
