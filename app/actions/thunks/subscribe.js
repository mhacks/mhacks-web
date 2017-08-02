import { actions } from '../../actions';
import { SubscribeRequests } from '../requests';

export default class SubscribeThunks {
    static subscribe(email) {
        return dispatch => {
            dispatch({
                type: actions.SUBSCRIBE_REQUEST,
                data: email
            });

            return SubscribeRequests.subscribe({ email }).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch({
                            type: actions.SUBSCRIBE_SUCCESS,
                            data: email,
                            message: json.message
                        });
                    });
                } else {
                    response.json().then(json => {
                        dispatch({
                            type: actions.SUBSCRIBE_ERROR,
                            data: email,
                            error: response.status,
                            message: json.message
                        });
                    });
                }
            });
        };
    }
}
