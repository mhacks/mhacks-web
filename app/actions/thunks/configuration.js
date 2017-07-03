import { ConfigurationPureActions } from '../pure';
import { ConfigurationRequests } from '../requests';

export default class ConfigurationThunks {
    static loadConfiguration() {
        return (dispatch, getState) => {
            dispatch(ConfigurationPureActions.loadConfigurationRequest());

            const token = getState().userState.data.token;

            return ConfigurationRequests.loadConfiguration(token).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        const { user } = json;
                        dispatch(
                            ConfigurationPureActions.loadConfigurationSuccess(
                                {
                                    isEmailVerified: user.email_verified,
                                    isApplicationSubmitted:
                                        user.application_submitted,
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
