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

    static updateProfile(token, body, files) {
        const formData = new FormData();

        if (files['resume']) {
            formData.append('resume', files['resume']);
        }

        if (files['avatar']) {
            formData.append('avatar', files['avatar']);
        }

        for (var key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        return fetch(endpoints.PROFILE, {
            method: 'post',
            headers: new Headers({
                Authorization: 'Bearer ' + token
            }),
            body: formData
        });
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
