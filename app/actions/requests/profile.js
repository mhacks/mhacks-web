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

    static updateProfile(token, body) {

        console.log('updating', body);
        return fetch(endpoints.PROFILE, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }),
            body: JSON.stringify(body)
        });
    }
}
