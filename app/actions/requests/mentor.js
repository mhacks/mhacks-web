import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class MentorRequests {
    static uploadApplication(token, body) {
        return fetch(endpoints.MENTOR_APPLICATION, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }),
            body: JSON.stringify(body)
        });
    }

    static loadApplication(token) {
        return fetch(endpoints.MENTOR_APPLICATION, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }

    static loadForm(token) {
        return fetch(endpoints.FORM + 'MentorApplication', {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }
}
