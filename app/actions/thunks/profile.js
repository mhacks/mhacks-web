import { ProfilePureActions } from '../pure';
import { ProfileRequests } from '../requests';

export default class ProfileThunks {
    static loadProfile() {
        return (dispatch, getState) => {
            dispatch(ProfilePureActions.loadProfileRequest());

            const token = getState().userState.data.token;

            return ProfileRequests.loadProfile(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { user } = json;

                        dispatch(
                            ProfilePureActions.loadProfileSuccess(
                                {
                                    name: user.full_name,
                                    birthday: user.birthday,
                                    email: user.email,
                                    isEmailVerified: user.email_verified,
                                    groups: user.groups
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
