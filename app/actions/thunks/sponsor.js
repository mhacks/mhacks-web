import { actions } from '../../actions';
import { SponsorRequests } from '../requests';

export default class SponsorThunks {
    static loadSponsors() {
        return dispatch => {
            dispatch({ type: actions.LOAD_SPONSOR_REQUEST });
            return SponsorRequests.loadSponsors().then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { sponsors } = json;
                        dispatch({
                            type: actions.LOAD_SPONSOR_SUCCESS,
                            data: sponsors,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.LOAD_SPONSOR_ERROR,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
