import { actions } from '../actions';

const initialState = {
    data: { teams: [] },
    fetching: false,
    fetched: false,
    error: null
};

export function teamsState(state = initialState, action) {
    switch (action.type) {
        case actions.LOAD_TEAMS_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                error: null
            };

        case actions.LOAD_TEAMS_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };

        case actions.LOAD_TEAMS_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    teams: action.data
                },
                message: action.message
            };

        case actions.JOIN_TEAM_REQUEST:
            return {
                ...state,
                data: {
                    ...state.data,
                    teams: state.data.teams.map(team => {
                        if (team.id !== action.data.id) {
                            return team;
                        } else {
                            return Object.assign({}, team, {
                                members: team.members.concat(action.data.user)
                            });
                        }
                    })
                },
                message: action.message
            };

        case actions.LEAVE_TEAM_REQUEST:
            return {
                ...state,
                data: {
                    ...state.data,
                    teams: state.data.teams.map(team => {
                        if (team.id !== action.data.id) {
                            return team;
                        } else {
                            return Object.assign({}, team, {
                                members: team.members.filter(
                                    member => member.email !== action.data.email
                                )
                            });
                        }
                    })
                },
                message: action.message
            };

        case actions.DELETE_TEAM_REQUEST:
            return {
                ...state,
                data: {
                    ...state.data,
                    teams: state.data.teams.filter(
                        team => team.id !== action.data
                    )
                },
                message: action.message
            };

        case actions.CREATE_TEAM_REQUEST:
            return {
                ...state,
                data: {
                    ...state.data,
                    teams: state.data.teams.concat(action.data)
                },
                message: action.message
            };

        case actions.LOAD_TEAM_FORM_SUCCESS:
            return {
                ...state,
                fetching: false,
                fetched: true,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case actions.LOAD_TEAM_FORM_ERROR:
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.error,
                message: action.message
            };
        case actions.LOAD_TEAM_FORM_REQUEST:
            return {
                ...state,
                fetching: true,
                fetched: false,
                data: {
                    ...state.data,
                    ...action.data
                }
            };

        default:
            return state;
    }
}
