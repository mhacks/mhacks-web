import { ReaderPureActions } from '../pure';
import { ReaderRequests } from '../requests';

export default class ReaderThunks {
    static loadApplications() {
        return dispatch => {
            dispatch(ReaderPureActions.loadApplicationsRequest());

            const token = localStorage.getItem('jwt');

            return ReaderRequests.loadApplications(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { applications } = json;
                        dispatch(
                            ReaderPureActions.loadApplicationsSuccess(
                                applications,
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ReaderPureActions.loadApplicationsError(
                                response.status,
                                json.message
                            )
                        );
                    });
                }
            });
        };
    }

    static reviewApplications(users, formData) {
        return dispatch => {
            const review = {
                users,
                ...formData
            };

            dispatch(ReaderPureActions.reviewApplicationsRequest(review));

            const token = localStorage.getItem('jwt');

            return ReaderRequests.reviewApplications(
                token,
                review
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            ReaderPureActions.reviewApplicationsSuccess(
                                review,
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ReaderPureActions.reviewApplicationsError(
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
