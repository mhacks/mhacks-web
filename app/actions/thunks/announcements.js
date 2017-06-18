import { AnnouncementsPureActions } from '../pure';
import { AnnouncementsRequests } from '../requests';

export default class AnnouncementsThunks {
    static loadAnnouncements() {
        return dispatch => {
            dispatch(AnnouncementsPureActions.loadAnnouncementsRequest());

            return AnnouncementsRequests.loadAnnouncements().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { announcements } = json;
                        dispatch(
                            AnnouncementsPureActions.loadAnnouncementsSuccess(
                                announcements,
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            AnnouncementsPureActions.loadAnnouncementsError(
                                response.status,
                                json.message
                            )
                        );
                    });
                }
            });
        };
    }
}
