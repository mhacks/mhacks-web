import { ProfilePureActions } from '../pure';
import { ProfileRequests } from '../requests';

export default class ProfileThunks {
    static loadProfile() {
        return dispatch => {
            dispatch(ProfilePureActions.loadProfileRequest());

            const token = localStorage.getItem('jwt');

            return ProfileRequests.loadProfile(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { user } = json;

                        const state = {
                            isEmailVerified: user.email_verified,
                            isApplicationSubmitted: user.application_submitted,
                            isLoggedIn: true,
                            isAdmin: user.groups && user.groups.indexOf('admin') !== -1,
                            isReader: user.groups && user.groups.indexOf('reader') !== -1,
                            isSponsor: user.groups && user.groups.indexOf('sponsor') !== -1,
                            user: {
                                name: user.full_name,
                                groups: user.groups,
                                avatars: user.avatar,
                                isResumeUploaded: user.resume_uploaded,
                                ...user
                            }
                        };

                        dispatch(
                            ProfilePureActions.loadProfileSuccess(
                                state,
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
        return dispatch => {
            dispatch(ProfilePureActions.updateProfileRequest(profile));

            const token = localStorage.getItem('jwt');

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
        return dispatch => {
            dispatch(ProfilePureActions.sendVerificationEmailRequest(email));

            const token = localStorage.getItem('jwt');

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
