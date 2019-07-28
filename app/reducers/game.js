import { actions } from '../actions';
import { objectState } from './initial_states.js';

const defaultGameState = {
    ...objectState,
    data: {
        questions: [],
        state: {},
    }
};

export function gameState(state = defaultGameState, action) {
    switch (action.type) {
        case actions.LOAD_GAME_QUESTIONS_REQUEST: // fallthrough
        case actions.LOAD_GAMESTATE_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.LOAD_GAME_QUESTIONS_FAILURE: // fallthrough
        case actions.LOAD_GAMESTATE_FAILURE:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.LOAD_GAME_QUESTIONS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: { ...state.data, questions: action.data.questions },
                message: action.message
            };

        case actions.LOAD_GAMESTATE_SUCCESS: // fallthrough
        case actions.UPLOAD_GAME_QUESTIONS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: { ...state.data, state: action.data.state },
                message: action.message
            };

        default:
            return state;
    }
}
