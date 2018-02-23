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
                        const { available, accepted, user } = json;
                        dispatch({
                            type: actions.LOAD_MENTORSHIP_TICKETS_SUCCESS,
                            data: {
                                available,
                                accepted,
                                user
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

    static submitTicket(ticket) {
        return dispatch => {
            dispatch({
                type: actions.SUBMIT_MENTORSHIP_TICKET_REQUEST,
                data: ticket
            });

            return postRequest(
                endpoints.MENTORSHIP_TICKETS,
                localStorage.getItem('jwt'),
                ticket
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.SUBMIT_MENTORSHIP_TICKET_SUCCESS,
                            data: ticket,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.SUBMIT_MENTORSHIP_TICKET_ERROR,
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

    static completeTicket(ticket) {
        return dispatch => {
            dispatch({
                type: actions.COMPLETE_MENTORSHIP_TICKET_REQUEST,
                data: ticket
            });

            return postRequest(
                endpoints.COMPLETE_MENTORSHIP_TICKET,
                localStorage.getItem('jwt'),
                {
                    ticket: ticket.id
                }
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.COMPLETE_MENTORSHIP_TICKET_SUCCESS,
                            data: ticket,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.COMPLETE_MENTORSHIP_TICKET_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static loadTicketForm() {
        return dispatch => {
            dispatch({
                type: actions.LOAD_MENTORSHIP_TICKET_FORM_REQUEST
            });

            return getResponseFromRoute(endpoints.MENTORSHIP_TICKET_FORM).then(
                response => {
                    if (response.status == 200) {
                        response.json().then(json => {
                            dispatch({
                                type:
                                    actions.LOAD_MENTORSHIP_TICKET_FORM_SUCCESS,
                                data: {
                                    form: json.form,
                                    FieldTypes: json.types
                                },
                                message: json.message
                            });
                        });
                    } else {
                        response.json().then(json => {
                            dispatch({
                                type: actions.LOAD_MENTORSHIP_TICKET_FORM_ERROR,
                                error: json.status,
                                message: json.message
                            });
                        });
                    }
                }
            );
        };
    }
}
