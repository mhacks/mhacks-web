import { actions } from '../../actions';
import { endpoints } from '../../constants';
import { getResponseFromRoute, postRequest } from '../../util/actions.js';

export default class MentorshipThunks {
    static loadTickets() {
        return dispatch => {
            dispatch({ type: actions.LOAD_MENTORSHIP_TICKETS_REQUEST });
            return getResponseFromRoute(
                endpoints.MENTORSHIP_TICKETS,
                localStorage.getItem('jwt')
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { available, accepted } = json;
                        dispatch({
                            type: actions.LOAD_MENTORSHIP_TICKETS_SUCCESS,
                            data: {
                                available,
                                accepted
                            },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_MENTORSHIP_TICKETS_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static acceptTicket(ticket) {
        return dispatch => {
            dispatch({
                type: actions.ACCEPT_MENTORSHIP_TICKET_REQUEST,
                data: ticket
            });

            return postRequest(
                endpoints.ACCEPT_MENTORSHIP_TICKET,
                localStorage.getItem('jwt'),
                {
                    ticket: ticket.id
                }
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ACCEPT_MENTORSHIP_TICKET_SUCCESS,
                            data: ticket,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.ACCEPT_MENTORSHIP_TICKET_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static unacceptTicket(ticket) {
        return dispatch => {
            dispatch({
                type: actions.UNACCEPT_MENTORSHIP_TICKET_REQUEST,
                data: ticket
            });

            return postRequest(
                endpoints.UNACCEPT_MENTORSHIP_TICKET,
                localStorage.getItem('jwt'),
                {
                    ticket: ticket.id
                }
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UNACCEPT_MENTORSHIP_TICKET_SUCCESS,
                            data: ticket,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UNACCEPT_MENTORSHIP_TICKET_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
