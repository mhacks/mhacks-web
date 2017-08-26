import { actions } from '../../actions';
import { TicketRequests } from '../requests';

export default class TicketThunks {
    static loadTicket() {
        return dispatch => {
            dispatch({ type: actions.LOAD_TICKET_REQUEST });
            return TicketRequests.loadTicket().then(response => {
                if (response.status == 200) {
                    response.text().then(ticket => {
                        dispatch({
                            type: actions.LOAD_TICKET_SUCCESS,
                            data: ticket,
                            message: 'Ticket loaded'
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_TICKET_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
