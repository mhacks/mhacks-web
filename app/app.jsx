import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';

import { Route, Switch, Redirect } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';
import { routes } from './constants';
import {
    Navigator,
    HomePage,
    Login,
    Logout,
    Profile,
    Apply,
    BlackoutPage,
    Reader,
    Confirm,
    MentorApply,
    SpeakerApply
} from './pages';
import { ConfigurationThunks } from './actions';
import { connect } from 'react-redux';
import { getUserMetadata } from './util/user.js';

// polyfill Promise for IE browsers
require('es6-promise').polyfill();

/* uncomment to view redux logs in console */
//import logger from 'redux-logger';

const history = createHistory();
const middleware = routerMiddleware(history);
const store = createStore(
    reducers,
    undefined,
    compose(applyMiddleware(thunkMiddleware, middleware))
);

window.s = store;

// Delay render of components until the store
// has rehydrated to prevent redirects and other
// weird effects
class AppProvider extends React.Component {
    componentWillMount() {
        this.props.dispatch(ConfigurationThunks.loadConfiguration());
    }

    getMetadata() {
        return getUserMetadata(store.getState().userState.data);
    }

    render() {
        if (
            this.props.configurationState.should_logout &&
            localStorage.getItem('jwt')
        ) {
            localStorage.removeItem('jwt');
            location.reload();
        }

        if (!this.props.configurationState.fetched) {
            return <div />;
        }

        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Navigator>
                        <Switch>
                            <Route
                                exact
                                path={routes.HOME}
                                component={HomePage}
                            />
                            <Route
                                exact
                                path={routes.LOGIN}
                                render={() => {
                                    if (this.getMetadata().isLoggedIn) {
                                        return <Redirect to={routes.PROFILE} />;
                                    }

                                    return <Login />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.LOGOUT}
                                render={() => {
                                    return <Logout />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.MENTOR_APPLICATION}
                                render={() => {
                                    if (this.getMetadata().isLoggedIn) {
                                        return <MentorApply />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.SPEAKER_APPLICATION}
                                render={() => {
                                    if (this.getMetadata().isLoggedIn) {
                                        return <SpeakerApply />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.PROFILE}
                                render={() => {
                                    if (this.getMetadata().isLoggedIn) {
                                        return <Profile />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.APPLY}
                                render={() => {
                                    const {
                                        isLoggedIn,
                                        isEmailVerified
                                    } = this.getMetadata();
                                    if (isLoggedIn && isEmailVerified) {
                                        return <Apply />;
                                    }

                                    if (isLoggedIn && !isEmailVerified) {
                                        return <Redirect to={routes.PROFILE} />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.HACKER_READER}
                                render={() => {
                                    const {
                                        isLoggedIn,
                                        isReader,
                                        isAdmin
                                    } = this.getMetadata();
                                    if (isLoggedIn && (isReader || isAdmin)) {
                                        return <Reader.Hacker />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.MENTOR_READER}
                                render={() => {
                                    const {
                                        isLoggedIn,
                                        isReader,
                                        isAdmin
                                    } = this.getMetadata();
                                    if (isLoggedIn && (isReader || isAdmin)) {
                                        return <Reader.Mentor />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.SPEAKER_READER}
                                render={() => {
                                    const {
                                        isLoggedIn,
                                        isReader,
                                        isAdmin
                                    } = this.getMetadata();
                                    if (isLoggedIn && (isReader || isAdmin)) {
                                        return <Reader.Speaker />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.CONFIRM}
                                render={() => {
                                    const {
                                        isLoggedIn,
                                        isAccepted
                                    } = this.getMetadata();
                                    if (isLoggedIn && isAccepted) {
                                        return <Confirm />;
                                    }

                                    if (isLoggedIn) {
                                        return <Redirect to={routes.PROFILE} />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.SUBSCRIBE}
                                component={BlackoutPage}
                            />
                            <Route component={HomePage} />
                        </Switch>
                    </Navigator>
                </ConnectedRouter>
            </Provider>
        );
    }
}

function mapStateToProps(state) {
    return {
        configurationState: state.configurationState
    };
}

render(
    React.createElement(connect(mapStateToProps)(AppProvider), {
        store
    }),
    document.getElementById('app')
);
