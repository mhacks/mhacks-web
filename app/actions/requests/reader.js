import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class ReaderRequests {
    static loadApplications(token) {
        return fetch(endpoints.ALL_APPLICATIONS, {
            method: 'get',
            headers: new Headers({
                Authorization: 'Bearer ' + token
            })
        });
    }

    static reviewApplications(token, body) {
        return fetch(endpoints.READER, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }),
            body: JSON.stringify(body)
        });
    }

    static loadForm(token, subform) {
        return fetch(
            endpoints.FORM + 'application' + (subform ? '/' + subform : ''),
            {
                method: 'get',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                })
            }
        );
    }
}
