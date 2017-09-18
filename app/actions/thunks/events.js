import { actions } from '../../actions';
import { endpoints } from '../../constants';
import { getResponseFromRoute } from '../../util/actions.js';

export default class EventsThunks {
    static loadEvents() {
        return dispatch => {
            dispatch({ type: actions.LOAD_EVENTS_REQUEST });
            return getResponseFromRoute(endpoints.EVENTS).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { events } = json;
                        dispatch({
                            type: actions.LOAD_EVENTS_SUCCESS,
                            data: events,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_EVENTS_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
