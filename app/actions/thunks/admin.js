import { AdminPureActions } from '../pure';
import { AdminRequests } from '../requests';

export default class AdminThunks {
    static loadApplications() {
        return dispatch => {
            dispatch(AdminPureActions.loadApplicationsRequest());

            const token = localStorage.getItem('jwt');

            return AdminRequests.loadApplications(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { applications } = json;
                        dispatch(
                            AdminPureActions.loadApplicationsSuccess(
                                applications,
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            AdminPureActions.loadApplicationsError(
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
