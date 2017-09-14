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
}
