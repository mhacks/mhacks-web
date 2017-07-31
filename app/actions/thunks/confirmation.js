import { ConfirmationPureActions } from '../pure';
import { ConfirmationRequests } from '../requests';

export default class ConfirmationThunks {
    static loadConfirmation() {
        return dispatch => {
            dispatch(ConfirmationPureActions.loadConfirmationRequest());

            const token = localStorage.getItem('jwt');

            return ConfirmationRequests.loadConfirmation(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            ConfirmationPureActions.loadConfirmationSuccess(
                                { confirmation: json.confirmation },
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ConfirmationPureActions.loadConfirmationError(
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

    static uploadConfirmation(formData) {
        return dispatch => {
            dispatch(
                ConfirmationPureActions.uploadConfirmationRequest(formData)
            );

            const token = localStorage.getItem('jwt');

            return ConfirmationRequests.uploadConfirmation(
                token,
                formData
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            ConfirmationPureActions.uploadConfirmationSuccess(
                                {
                                    confirmation: json.confirmation
                                },
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ConfirmationPureActions.uploadConfirmationError(
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
