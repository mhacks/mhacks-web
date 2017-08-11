import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class SponsorRequests {
    static loadSponsors() {
        return fetch(endpoints.SPONSOR, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
    }
}
