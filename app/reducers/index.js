import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { theme } from './theme.js';
import { subscribeState } from './subscribe.js';
import { userState } from './user.js';

const rootReducer = combineReducers({
    router: routerReducer,
    theme,
    subscribeState,
    userState
});

export default rootReducer;
