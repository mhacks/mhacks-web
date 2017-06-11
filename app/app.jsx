import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';

import { Route, Switch, Redirect } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';
import { routes } from './constants';
import { Navigator, HomePage, Login, Logout, Profile } from './pages';

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

persistStore(store, {
    whitelist: [
        'authState'
    ]
});

window.s = store;

render(
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
                            if (store.getState().authState.data.isLoggedIn) {
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
                            if (store.getState().authState.data.isLoggedIn) {
                                return <Profile />;
                            }

                            return <Redirect to={routes.LOGIN} />;
                        }}
                    />
                    <Route
                        component={HomePage}
                    />
                </Switch>
            </Navigator>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
);
