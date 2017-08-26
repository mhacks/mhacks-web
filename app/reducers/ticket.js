import { actions } from '../actions';
import { arrayState } from './initial_states.js';

export function ticketState(state = arrayState, action) {
    switch (action.type) {
        case actions.LOAD_TICKET_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.LOAD_TICKET_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.LOAD_TICKET_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: action.data,
                message: action.message
            };

        default:
            return state;
    }
}
