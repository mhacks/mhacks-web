import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class TicketRequests {
    static loadTicket() {
        return fetch(endpoints.TICKET, {
            method: 'get'
        });
    }
}
