import { ConfigurationPureActions } from '../pure';
import { ConfigurationRequests } from '../requests';

export default class ConfigurationThunks {
    static loadConfiguration() {
        return (dispatch) => {
            dispatch(ConfigurationPureActions.loadConfigurationRequest());

            const token = localStorage.getItem('jwt');

            return ConfigurationRequests.loadConfiguration(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const {user, configuration} = json;

                        const state = {
                            configuration
                        }

                        if (user) {
                            state['userData'] = {
                                isEmailVerified: user.email_verified,
                                isApplicationSubmitted:
                                    user.application_submitted,
                                isLoggedIn: true,
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
