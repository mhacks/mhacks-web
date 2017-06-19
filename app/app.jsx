import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';

import { Route, Switch, Redirect } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import createFilter from 'redux-persist-transform-filter';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';
import { routes } from './constants';
import { Navigator, HomePage, Login, Logout, Profile, Apply, LivePage, BlackoutPage } from './pages';

// polyfill Promise for IE browsers
require('es6-promise').polyfill();

/* uncomment to view redux logs in console */
// import logger from 'redux-logger'

const history = createHistory();
const middleware = routerMiddleware(history);
const store = createStore(
    reducers,
    undefined,
    compose(
        applyMiddleware(thunkMiddleware, middleware),
        autoRehydrate()
    )
);

window.s = store;

// Delay render of components until the store
// has rehydrated to prevent redirects and other
// weird effects
class AppProvider extends React.Component {
    constructor() {
        super();

        this.state = { rehydrated: false };
    }

    componentWillMount() {
        const dataWhitelistFilter = createFilter(
            'userState',
            ['data']
        );

        persistStore(store, {
            transforms: [
                dataWhitelistFilter
            ]
        }, () => {
            this.setState({ rehydrated: true });
        });
    }

    render() {
        if (!this.state.rehydrated) {
            return (<div></div>);
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
                                path={routes.LIVE}
                                component={LivePage}
                            />
                            <Route
                                exact
                                path={routes.LOGIN}
                                render={() => {
                                    const userData = store.getState().userState.data;

                                    if (userData.isLoggedIn) {
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
                                    const userData = store.getState().userState.data;

                                    if (userData.isLoggedIn) {
                                        return <Profile />;
                                    }

                                    return <Redirect to={routes.LOGIN} />;
                                }}
                            />
                            <Route
                                exact
                                path={routes.APPLY}
                                render={() => {
                                    const userData = store.getState().userState.data;

                                    if (userData.isLoggedIn && userData.isEmailVerified) {
                                        return <Apply />;
                                    }

                                    if (userData.isLoggedIn && !userData.isEmailVerified) {
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
                            <Route
                                component={HomePage}
                            />
                        </Switch>
                    </Navigator>
                </ConnectedRouter>
            </Provider>
        );
    }
}

render(
    <AppProvider />,
    document.getElementById('app')
);
