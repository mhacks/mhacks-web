const defaultState = {
    fetching: false,
    fetched: false,
    error: null
};

const arrayState = {
    fetching: false,
    fetched: false,
    error: null,
    data: []
};

const objectState = {
    fetching: false,
    fetched: false,
    error: null,
    data: {}
};

const initialUserState = {
    fetching: false,
    fetched: false,
    error: null,
    data: {
        isLoggedIn: false,
        isEmailVerified: false,
        isApplicationSubmitted: false,
        token: null,
        email: null,
        user: {},
        app: {}
    }
};

export { defaultState, arrayState, objectState, initialUserState };
