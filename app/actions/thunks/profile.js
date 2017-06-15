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
                                    isEmailVerified: user.email_verified,
                                    isApplicationSubmitted: user.application_submitted,
                                    user: {
                                        name: user.full_name,
                                        birthday: user.birthday,
                                        major: user.major,
                                        university: user.university,
                                        email: user.email,
                                        groups: user.groups,
                                        avatars: user.avatar,
                                        isResumeUploaded: user.resume_uploaded
                                    }
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

    static updateProfile(profile, files) {
        return (dispatch, getState) => {
            dispatch(ProfilePureActions.updateProfileRequest(profile));

            const token = getState().userState.data.token;

            return ProfileRequests.updateProfile(
                token,
                profile,
                files
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            ProfilePureActions.updateProfileSuccess(
                                {
                                    user: profile
                                },
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ProfilePureActions.updateProfileError(
                                response.status,
                                json.message
                            )
                        );
                    });
                }
            });
        };
    }

    static sendVerificationEmail(email) {
        return (dispatch, getState) => {
            dispatch(ProfilePureActions.sendVerificationEmailRequest(email));

            const token = getState().userState.data.token;

            return ProfileRequests.sendVerificationEmail(
                token,
                email
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        dispatch(
                            ProfilePureActions.sendVerificationEmailSuccess({
                                email,
                                message: json.message
                            })
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ProfilePureActions.sendVerificationEmailError(
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
