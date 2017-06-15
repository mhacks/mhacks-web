import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class AuthRequests {
    static register(body) {
        return fetch(endpoints.REGISTER, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body),
            credentials: 'include'
        });
    }

    static login(body) {
        return fetch(endpoints.LOGIN, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body),
            credentials: 'include'
        });
    }

    static logout() {
        return fetch(endpoints.LOGOUT, {
            method: 'post',
            credentials: 'include'
        });
    }
}
