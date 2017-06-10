import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';

import { Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';
import { routes } from './constants';
import { Navigator, BlackoutPage, HomePage, Login } from './pages';

/* uncomment to view redux logs in console */
// import logger from 'redux-logger'

const history = createHistory();
const middleware = routerMiddleware(history);
let store = applyMiddleware(thunkMiddleware, middleware)(createStore)(reducers);

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
                        path={routes.SUBSCRIBE}
                        component={BlackoutPage}
                    />
                    <Route
                        exact
                        path={routes.LOGIN}
                        component={Login}
                    />
                    <Route
                        component={BlackoutPage}
                    />
                </Switch>
            </Navigator>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
);
