import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { theme } from './theme_reducer.js'

const rootReducer = combineReducers({
    router: routerReducer,
    theme
})

export default rootReducer
