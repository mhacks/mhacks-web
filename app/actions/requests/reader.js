import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';
import { getResponseFromRoute } from '../../util/actions.js';

export default class ReaderRequests {
    static loadHackerApplications(token) {
        return getResponseFromRoute(endpoints.ALL_HACKER_APPLICATIONS, token);
    }

    static loadMentorApplications(token) {
        return getResponseFromRoute(endpoints.ALL_MENTOR_APPLICATIONS, token);
    }

    static loadSpeakerApplications(token) {
        return getResponseFromRoute(endpoints.ALL_SPEAKER_APPLICATIONS, token);
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
