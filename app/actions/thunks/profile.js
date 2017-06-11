import { ProfilePureActions } from '../pure';
import { ProfileRequests } from '../requests';

export default class ProfileThunks {
    static loadProfile() {
        return (dispatch, getState) => {
            dispatch(ProfilePureActions.loadProfileRequest());

            const token = getState().authState.data.token;

            return ProfileRequests.loadProfile(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            ProfilePureActions.loadProfileSuccess(
                                {
                                    name: json.full_name,
                                    birthday: json.birthday,
                                    email: json.email
                                },
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ProfilePureActions.loadProfileError(
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
}
