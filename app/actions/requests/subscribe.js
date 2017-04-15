import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class SubscribeRequests {
    static subscribe(body) {
        return fetch(endpoints.SUBSCRIBE, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body)
        });
    }
}
