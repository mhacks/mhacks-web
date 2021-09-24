import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks } from '../actions';
import { getUserMetadata } from '../util/user.js';

import { PageContainer, Alert } from '../components';

import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import MHForm from '../components/MHForm';

const FullscreenColumnContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 20px 50px 20px;
`;

const SectionHeader = styled.h2`
    text-transform: uppercase;
    font-size: 24px;
    color: ${props => props.color};
    margin: 0;
`;

const AlertContainer = styled.div`
    margin-top: 30px;
`;

const Subhead = styled.p`
    margin: 20px 0 0 0;
    color: ${props => props.theme.secondary};
`;

const Link = styled.a`
    color: ${props => props.color};
    cursor: pointer;
`;

class EditProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: OrderedSet()
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onClickRequestEmailVerification = this.onClickRequestEmailVerification.bind(
            this
        );
    }

    addNotification(message, key, action) {
        return this.setState({
            notifications: this.state.notifications.add({
                message,
                key,
                action: action || 'Dismiss',
                onClick: (notification, deactivate) => {
                    deactivate();
                    this.removeNotification(key);
                }
            })
        });
    }

    removeNotification(key) {
        this.setState({
            notifications: this.state.notifications.filter(n => n.key !== key)
        });
    }

    componentDidMount() {
        this.props.dispatch(ProfileThunks.loadProfile());
        this.props.dispatch(ProfileThunks.loadForm());
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.userState.data.form && nextProps.userState.data.user) {
            for (var i in nextProps.userState.data.user) {
                if (i in nextProps.userState.data.form) {
                    nextProps.userState.data.form[i].default =
                        nextProps.userState.data.user[i];
                }
            }
        }

        return {
            userState: nextProps.userState
        };
    }

    onSubmit(formData, files) {
        this.props.dispatch(ProfileThunks.updateProfile(formData, files));

        this.addNotification('Profile Saved!', 'save');
    }

    onClickRequestEmailVerification(e) {
        e.preventDefault();

        var email = this.props.userState.data.user.email;

        this.props.dispatch(ProfileThunks.sendVerificationEmail(email));
    }

    renderEmailVerificationPage() {
        const userData = this.props.userState.data;
        return (
            <PageContainer>
                <FullscreenColumnContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Unverified Email
                    </SectionHeader>
                    <p>
                        Thank you for signing up! At the moment our email
                        verification service is down, so we will be manually
                        verifying all new sign-ups for the time being. Please
                        check back in again later, and if you're still having
                        issues, feel free to email director@mhacks.org. Thank
                        you for your patience!
                    </p>
                </FullscreenColumnContainer>
            </PageContainer>
        );
    }

    render() {
        if (
            !this.state.userState ||
            !this.state.userState.fetched ||
            !this.state.userState.data ||
            (!this.state.userState.data.form && !this.state.userState.data.user)
        ) {
            return null;
        }

        const userData = this.props.userState.data;
        const {
            isApplicationSubmitted,
            isEmailVerified,
            isApplicationReviewed
        } = getUserMetadata(userData);

        if (!isEmailVerified) {
            return this.renderEmailVerificationPage();
        }

        return (
            <PageContainer>
                <FullscreenColumnContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Edit Profile
                    </SectionHeader>
                    <div>
                        {this.props.userState.error ? (
                            <AlertContainer>
                                <Alert message={this.props.userState.message} />
                            </AlertContainer>
                        ) : null}
                        {isApplicationSubmitted && !isApplicationReviewed ? (
                            <AlertContainer>
                                <Alert
                                    message={`Your application is submitted but you can still make changes on the application page to update it! Thanks for applying to ${this.props.configurationState.data.app_name}`}
                                    style={{
                                        backgroundColor: '#01FF70',
                                        color: '#3D9970'
                                    }}
                                />
                            </AlertContainer>
                        ) : null}
                        <Subhead>
                            Update your profile with some info about yourself.
                            This will be automatically populated into your
                            application and persist through hackathons!
                        </Subhead>
                        <MHForm
                            schema={this.state.userState.data.form}
                            FieldTypes={this.state.userState.data.FieldTypes}
                            theme={this.props.theme}
                            hidden={{
                                email_verified: true,
                                application_submitted: true,
                                groups: true
                            }}
                            onSubmit={this.onSubmit}
                        />
                    </div>
                </FullscreenColumnContainer>
                <NotificationStack
                    notifications={this.state.notifications.toArray()}
                    onDismiss={notification =>
                        this.setState({
                            notifications: this.state.notifications.delete(
                                notification
                            )
                        })
                    }
                    activeBarStyleFactory={(index, style) => {
                        return Object.assign(
                            {},
                            style,
                            { bottom: `${2 + index * 4}rem` },
                            { zIndex: 10000 }
                        );
                    }}
                    dismissAfter={5000}
                />
            </PageContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data,
        configurationState: state.configurationState
    };
}

export default connect(mapStateToProps)(EditProfile);
