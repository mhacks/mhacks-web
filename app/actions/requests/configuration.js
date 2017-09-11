import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class ConfigurationRequests {
    static loadConfiguration(token) {
        return fetch(endpoints.CONFIGURATION, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }

    static updateConfiguration(token, body) {
        return fetch(endpoints.CONFIGURATION + '/control', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }),
            body: JSON.stringify(body)
        });
    }

    static loadForm(token) {
        return fetch(endpoints.FORM + 'configuration', {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }
}
