import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';
import { getResponseFromRoute } from '../../util/actions.js';

export default class ReaderRequests {
    static loadHackerApplications() {
        return getResponseFromRoute(endpoints.ALL_HACKER_APPLICATIONS);
    }

    static loadSponsorPortalApplications() {
        return getResponseFromRoute(endpoints.ALL_SPONSOR_PORTAL_APPLICATIONS);
    }

    static loadMentorApplications() {
        return getResponseFromRoute(endpoints.ALL_MENTOR_APPLICATIONS);
    }

    static loadSpeakerApplications() {
        return getResponseFromRoute(endpoints.ALL_SPEAKER_APPLICATIONS);
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
