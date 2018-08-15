import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';
import { postFormResponseFromRoute } from '../../util/actions';

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

    static updateProfile(token, body, files) {
        return postFormResponseFromRoute(endpoints.PROFILE, body, files);
    }

    static sendVerificationEmail(token, email) {
        return fetch(endpoints.VERIFY, {
            method: 'post',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ email })
        });
    }

    static loadForm(token) {
        return fetch(endpoints.FORM + 'user', {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }
}
