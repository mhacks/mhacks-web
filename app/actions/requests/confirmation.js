import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class ConfirmationRequests {
    static uploadConfirmation(token, body) {
        return fetch(endpoints.CONFIRMATION, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }),
            body: JSON.stringify(body)
        });
    }

    static loadConfirmation(token) {
        return fetch(endpoints.CONFIRMATION, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }

    static loadForm(token) {
        return fetch(endpoints.FORM + 'confirmation', {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }
}
