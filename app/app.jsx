import React from 'react' // eslint-disable-line no-unused-vars
import { render } from 'react-dom'

import { Route } from 'react-router'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import reducers from './reducers'
import { routes } from './constants'
import { Navigator, HomePage, SubscribePage } from './pages'

/* uncomment to view redux logs in console */
// import createLogger from 'redux-logger'
// const logger = createLogger()

const history = createHistory()
const middleware = routerMiddleware(history)
let store = applyMiddleware(thunkMiddleware, middleware)(createStore)(reducers)

window.s = store;

render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Navigator>
                <div>
                    <Route exact path={routes.HOME} component={HomePage}/>
                    <Route exact path={routes.SUBSCRIBE} component={SubscribePage}/>
                </div>
            </Navigator>
        </ConnectedRouter>
    </Provider>
), document.getElementById('app'))