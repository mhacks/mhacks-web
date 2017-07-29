import { ConfigurationPureActions } from '../pure';
import { ConfigurationRequests } from '../requests';
import { ProfileFields } from '../../constants/forms';

export default class ConfigurationThunks {
    static loadConfiguration() {
        return dispatch => {
            dispatch(ConfigurationPureActions.loadConfigurationRequest());

            const token = localStorage.getItem('jwt');

            return ConfigurationRequests.loadConfiguration(
                token
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { user, configuration } = json;

                        const state = {
                            configuration
                        };

                        if (user) {
                            state.userData = {
                                isEmailVerified: user.email_verified,
                                isApplicationSubmitted:
                                    user.application_submitted,
                                isLoggedIn: true,
                                isAdmin:
                                    user.groups &&
                                        user.groups.indexOf('admin') !== -1,
                                isReader:
                                    user.groups &&
                                        user.groups.indexOf('reader') !== -1,
                                isSponsor:
                                    user.groups &&
                                        user.groups.indexOf('sponsor') !== -1,
                                user: {
                                    name: user.full_name,
                                    groups: user.groups,
                                    avatars: user.avatar,
                                    isResumeUploaded: user.resume_uploaded
                                }
                            };

                            for (const key of Object.keys(ProfileFields)) {
                                if (user.hasOwnProperty(key)) {
                                    state.userData.user[key] = user[key];
                                }
                            }
                        }

                        dispatch(
                            ConfigurationPureActions.loadConfigurationSuccess(
                                state,
                                json.message
                            )
                        );
                    });
                } else {
                    response.json().then(json => {
                        dispatch(
                            ConfigurationPureActions.loadConfigurationError(
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
