import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class AdminRequests {
    static loadApplications(token) {
        return fetch(endpoints.APPLICATION, {
            method: 'get',
            headers: new Headers({
                Authorization: 'Bearer ' + token
            })
        });
    }
}
