import { ApplicationPureActions } from '../pure';
import { ApplicationRequests } from '../requests';

export default class ApplicationThunks {
    static loadApplication() {
        return dispatch => {
            dispatch(ApplicationPureActions.loadApplicationRequest());

            const token = localStorage.getItem('jwt');

            return ApplicationRequests.loadApplication(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { application } = json;

                        const state = {
                            app: application
                        };

                        dispatch(
                            ApplicationPureActions.loadApplicationSuccess(
                                state,
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ApplicationPureActions.loadApplicationError(
                                token,
                                response.status,
                                json.message
                            )
                        );
                    });
                }
            });
        };
    }

    static uploadApplication(application, files) {
        return dispatch => {
            dispatch(
                ApplicationPureActions.uploadApplicationRequest(application)
            );

            const token = localStorage.getItem('jwt');

            return ApplicationRequests.uploadApplication(
                token,
                application,
                files
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            ApplicationPureActions.uploadApplicationSuccess(
                                {
                                    isApplicationSubmitted: true,
                                    app: json.app
                                },
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ApplicationPureActions.uploadApplicationError(
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
