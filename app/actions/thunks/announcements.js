import { actions } from '../../actions';
import { AnnouncementsRequests } from '../requests';

export default class AnnouncementsThunks {
    static loadAnnouncements() {
        return dispatch => {
            dispatch({ type: actions.LOAD_ANNOUNCEMENTS_REQUEST });
            return AnnouncementsRequests.loadAnnouncements().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { announcements } = json;
                        dispatch({
                            type: actions.LOAD_ANNOUNCEMENTS_SUCCESS,
                            data: announcements,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_ANNOUNCEMENTS_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
