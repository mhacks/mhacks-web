import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { theme } from './theme.js';
import { subscribeState } from './subscribe.js';
import { userState } from './user.js';
import { announcementsState } from './announcements.js';
import { ticketState } from './ticket.js';
import { configurationState } from './configuration.js';
import { readerState } from './reader.js';
import { sponsorState } from './sponsor.js';

const rootReducer = combineReducers({
    router: routerReducer,
    theme,
    subscribeState,
    userState,
    announcementsState,
    ticketState,
    configurationState,
    readerState,
    sponsorState
});

export default rootReducer;
