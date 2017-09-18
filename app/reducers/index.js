import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { theme } from './theme.js';
import { subscribeState } from './subscribe.js';
import { userState } from './user.js';
import { announcementsState } from './announcements.js';
import { configurationState } from './configuration.js';
import { readerState } from './reader.js';
import { sponsorState } from './sponsor.js';
import { teamsState } from './teams.js';
import { adminState } from './admin.js';
import { eventsState } from './events.js';

const rootReducer = combineReducers({
    router: routerReducer,
    theme,
    subscribeState,
    userState,
    announcementsState,
    configurationState,
    readerState,
    sponsorState,
    teamsState,
    adminState,
    eventsState
});

export default rootReducer;
