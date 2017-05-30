import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { theme } from './theme.js';
import { subscribeState } from './subscribe.js';
import { authState } from './auth.js';

const rootReducer = combineReducers({
    router: routerReducer,
    theme,
    subscribeState,
    authState
});

export default rootReducer;
