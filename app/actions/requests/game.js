import fetch from 'isomorphic-fetch';
import { endpoints } from '../../constants';

export default class GameRequests {
    static loadQuestions(token) {
        return fetch(endpoints.GAME_QUESTIONS, {
            method: 'get',
            headers: new Headers({
                Authorization: 'Bearer ' + token
            })
        });
    }

    static loadGameState(token) {
        return fetch(endpoints.GAME, {
            method: 'get',
            headers: new Headers({
                Authorization: 'Bearer ' + token
            })
        });
    }

    static uploadAnswers(token, answers) {
        return fetch(endpoints.GAME, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }),
            body: JSON.stringify({ answers: answers })
        });
    }
}
