import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class ApplicationRequests {
    static uploadApplication(token, body, files) {
        const formData = new FormData();

        if (files['resume']) {
            formData.append('resume', files['resume']);
        }

        for (var key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        return fetch(endpoints.APPLICATION, {
            method: 'post',
            headers: new Headers({
                Authorization: 'Bearer ' + token
            }),
            body: formData
        });
    }
}
