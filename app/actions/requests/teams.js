import { endpoints } from '../../constants';
import {
    getResponseFromRoute,
    postRequest,
    deleteRequest
} from '../../util/actions.js';

export default class TeamsRequests {
    static loadTeams(token) {
        return getResponseFromRoute(endpoints.TEAM_BUILDING, token);
    }

    static createTeam(token, body) {
        return postRequest(endpoints.TEAM_BUILDING, token, body);
    }

    static deleteTeam(token, body) {
        return deleteRequest(endpoints.TEAM_BUILDING, token, body);
    }

    static joinTeam(token, body) {
        return postRequest(endpoints.TEAM_BUILDING + 'member', token, body);
    }

    static leaveTeam(token, body) {
        return deleteRequest(endpoints.TEAM_BUILDING + 'member', token, body);
    }
}
