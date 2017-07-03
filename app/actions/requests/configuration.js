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
}
