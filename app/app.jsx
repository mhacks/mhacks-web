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
    ReaderPage
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
                                path={routes.READER}
                                render={() => {
                                    const {
                                        isLoggedIn,
                                        isReader,
                                        isAdmin
                                    } = this.getMetadata();
                                    if (isLoggedIn && (isReader || isAdmin)) {
                                        return <ReaderPage />;
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
