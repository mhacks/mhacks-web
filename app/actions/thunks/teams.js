import { actions } from '../../actions';
import { TeamsRequests } from '../requests';

export default class TeamsThunks {
    static loadTeams() {
        return dispatch => {
            dispatch({ type: actions.LOAD_TEAMS_REQUEST });

            const token = localStorage.getItem('jwt');

            return TeamsRequests.loadTeams(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { teams } = json;
                        dispatch({
                            type: actions.LOAD_TEAMS_SUCCESS,
                            data: teams,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_TEAMS_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
    static createTeam(body) {
        return dispatch => {
            dispatch({ type: actions.CREATE_TEAM_REQUEST });

            const token = localStorage.getItem('jwt');

            return TeamsRequests.createTeam(token, body).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        TeamsRequests.loadTeams(token).then(teamsResponse => {
                            teamsResponse.json().then(teamsJson => {
                                const { teams } = teamsJson;
                                dispatch({
                                    type: actions.CREATE_TEAM_SUCCESS,
                                    data: teams,
                                    message: json.message
                                });
                            });
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.CREATE_TEAM_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
    static deleteTeam(teamId) {
        return dispatch => {
            dispatch({ type: actions.DELETE_TEAM_REQUEST });

            const token = localStorage.getItem('jwt');
            const body = { team: teamId };

            return TeamsRequests.deleteTeam(token, body).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        TeamsRequests.loadTeams(token).then(teamsResponse => {
                            teamsResponse.json().then(teamsJson => {
                                const { teams } = teamsJson;
                                dispatch({
                                    type: actions.DELETE_TEAM_SUCCESS,
                                    data: teams,
                                    message: json.message
                                });
                            });
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.DELETE_TEAM_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
    static joinTeam(teamId) {
        return dispatch => {
            dispatch({ type: actions.JOIN_TEAM_REQUEST });

            const token = localStorage.getItem('jwt');
            const body = { team: teamId };

            return TeamsRequests.joinTeam(token, body).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        TeamsRequests.loadTeams(token).then(teamsResponse => {
                            teamsResponse.json().then(teamsJson => {
                                const { teams } = teamsJson;
                                dispatch({
                                    type: actions.JOIN_TEAM_SUCCESS,
                                    data: teams,
                                    message: json.message
                                });
                            });
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.JOIN_TEAM_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
    static leaveTeam(teamId) {
        return dispatch => {
            dispatch({ type: actions.LEAVE_TEAM_REQUEST });

            const token = localStorage.getItem('jwt');
            const body = { team: teamId };

            return TeamsRequests.leaveTeam(token, body).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        TeamsRequests.loadTeams(token).then(teamsResponse => {
                            teamsResponse.json().then(teamsJson => {
                                const { teams } = teamsJson;
                                dispatch({
                                    type: actions.LEAVE_TEAM_SUCCESS,
                                    data: teams,
                                    message: json.message
                                });
                            });
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LEAVE_TEAM_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }

    static loadTeamForm() {
        return dispatch => {
            dispatch({
                type: actions.LOAD_TEAM_FORM_REQUEST
            });

            const token = localStorage.getItem('jwt');

            return TeamsRequests.loadTeamForm(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_TEAM_FORM_SUCCESS,
                            data: { form: json.form, FieldTypes: json.types },
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_TEAM_FORM_ERROR,
                            error: json.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
