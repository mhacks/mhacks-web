import { endpoints } from '../../constants';
import { getResponseFromRoute } from '../../util/actions.js';

export default class TeamsRequests {
    static loadTeams(token) {
        return getResponseFromRoute(endpoints.TEAM_BUILDING, token);
    }
}
