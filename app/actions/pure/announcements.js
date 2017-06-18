import { reduxActions } from '../../constants';

export default class AnnouncementsPureActions {
    static loadAnnouncementsRequest(data) {
        return {
            type: reduxActions.LOAD_ANNOUNCEMENTS_REQUEST,
            data
        };
    }

    static loadAnnouncementsError(data, error, message) {
        return {
            type: reduxActions.LOAD_ANNOUNCEMENTS_ERROR,
            data,
            error,
            message
        };
    }

    static loadAnnouncementsSuccess(data, message) {
        return {
            type: reduxActions.LOAD_ANNOUNCEMENTS_SUCCESS,
            data,
            message
        };
    }
}
