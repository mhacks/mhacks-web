import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { theme } from './theme.js';
import { subscribeState } from './subscribe.js';

const rootReducer = combineReducers({
  router: routerReducer,
  theme,
  subscribeState
});

export default rootReducer;
