import { actions } from '../../actions';
import { GameRequests } from '../requests';

export default class GameThunks {
    static loadQuestions() {
        return dispatch => {
            dispatch({
                type: actions.LOAD_GAME_QUESTIONS_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return GameRequests.loadQuestions(token).then(response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_GAME_QUESTIONS_SUCCESS,
                            data: { questions: json.questions },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_GAME_QUESTIONS_FAILURE,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static loadGameState() {
        return dispatch => {
            dispatch({
                type: actions.LOAD_GAMESTATE_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return GameRequests.loadGameState(token).then(response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_GAMESTATE_SUCCESS,
                            data: { state: json.state },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_GAMESTATE_FAILURE,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static uploadAnswers(answers) {
        return dispatch => {
            dispatch({
                type: actions.UPLOAD_GAME_QUESTIONS_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return GameRequests.uploadAnswers(token, answers).then(response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_GAME_QUESTIONS_SUCCESS,
                            data: { state: json.state },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.UPLOAD_GAME_QUESTIONS_FAILURE,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
