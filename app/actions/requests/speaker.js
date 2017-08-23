import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class SpeakerRequests {
    static uploadApplication(token, body, files) {
        const formData = new FormData();

        for (var file in files) {
            if (files.hasOwnProperty(file)) {
                formData.append(file, files[file]);
            }
        }

        for (var key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        return fetch(endpoints.SPEAKER_APPLICATION, {
            method: 'post',
            headers: new Headers({
                Authorization: 'Bearer ' + token
            }),
            body: formData
        });
    }

    static loadApplication(token) {
        return fetch(endpoints.SPEAKER_APPLICATION, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }

    static loadForm(token) {
        return fetch(endpoints.FORM + 'SpeakerApplication', {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            })
        });
    }
}
