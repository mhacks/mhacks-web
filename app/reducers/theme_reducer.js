import { reduxActions } from '../constants'
import { objectState } from './initial_states.js'
import Theme from '../styles'

const defaultTheme = {
    ...objectState,
    data: Theme
}

export function theme(state = defaultTheme, action) {
    switch (action.type){
        case reduxActions.GET_THEME_REQUEST:
            return {...state, fetching: true, fetched: false, error: null}
        case reduxActions.GET_THEME_ERROR:
            return {...state, fetching: false, fetched: false, error: action.error.status}
        case reduxActions.RETURN_THEME:
            return {...state, fetching: false, fetched: true, data: action.data}
        default:
            return state
    }
}