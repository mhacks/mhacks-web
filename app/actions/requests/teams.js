import { endpoints } from '../../constants';
import {
    getResponseFromRoute,
    postRequest,
    deleteRequest
} from '../../util/actions.js';

export default class TeamsRequests {
    static loadTeams() {
        return getResponseFromRoute(endpoints.TEAM_BUILDING);
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

    static loadTeamForm() {
        return getResponseFromRoute(endpoints.TEAM_BUILDING_FORM);
    }
}
