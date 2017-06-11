import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class ProfileRequests {
    static loadProfile(token) {
        return fetch(endpoints.PROFILE, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }
}
