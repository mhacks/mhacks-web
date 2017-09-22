import { actions } from '../actions';
const initialState = {
    fetching: false,
    fetched: false,
    error: null,
    data: {
        user: [],
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
                data: {
                    ...state.data,
                    ...action.data
                },
                message: action.message
            };

        case actions.ACCEPT_MENTORSHIP_TICKET_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    ...state.data,
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
                    ...state.data,
                    accepted: state.data.accepted.filter(
                        ticket => ticket.id !== action.data.id
                    ),
                    available: state.data.available.concat(action.data)
                }
            };

        case actions.SUBMIT_MENTORSHIP_TICKET_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    ...state.data,
                    user: state.data.user.concat(action.data)
                }
            };

        case actions.COMPLETE_MENTORSHIP_TICKET_REQUEST:
            return {
                ...state,
                data: {
                    ...state.data,
                    user: state.data.user.map(ticket => {
                        if (ticket.id === action.data.id) {
                            return Object.assign({}, ticket, {
                                is_complete: true
                            });
                        } else {
                            return ticket;
                        }
                    })
                }
            };

        case actions.LOAD_MENTORSHIP_TICKET_FORM_SUCCESS:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    ...state.data,
                    ...action.data
                }
            };

        default:
            return state;
    }
}
