import { actions } from '../actions';
const initialState = {
    fetching: false,
    fetched: false,
    error: null,
    data: {
        available: [],
        accepted: []
    }
};

export function mentorshipState(state = initialState, action) {
    switch (action.type) {
        case actions.LOAD_MENTORSHIP_TICKETS_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.LOAD_MENTORSHIP_TICKETS_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.LOAD_MENTORSHIP_TICKETS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: action.data,
                message: action.message
            };

        case actions.ACCEPT_MENTORSHIP_TICKET_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    available: state.data.available.filter(
                        ticket => ticket.id !== action.data.id
                    ),
                    accepted: state.data.accepted.concat(action.data)
                }
            };

        case actions.ACCEPT_MENTORSHIP_TICKET_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true
            };

        case actions.UNACCEPT_MENTORSHIP_TICKET_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    accepted: state.data.available.filter(
                        ticket => ticket.id !== action.data.id
                    ),
                    available: state.data.accepted.concat(action.data)
                }
            };

        default:
            return state;
    }
}
