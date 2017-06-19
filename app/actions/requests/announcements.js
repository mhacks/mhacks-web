import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class AnnouncementsRequests {
    static loadAnnouncements() {
        return fetch(endpoints.ANNOUNCEMENTS, {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
    }
}
