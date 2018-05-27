import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks } from '../actions';
import { FieldTypes, ProfileFields } from '../constants/forms';
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

        const userData = this.props.userState.data.user;
        this.state = {
            birthday: userData.birthday
                ? new Date(userData.birthday).toISOString().split('T')[0]
                : '',
            university: userData.university || '',
            major: userData.major || '',
            avatars: userData.avatars || [],
            isResumeUploaded: userData.isResumeUploaded || false,
            notifications: OrderedSet()
        };

        for (const key of Object.keys(ProfileFields)) {
            if (
                ProfileFields[key] === FieldTypes.TEXT ||
                ProfileFields[key] === FieldTypes.LINK
            ) {
                this.state[key] = userData[key] || '';
            } else if (ProfileFields[key] === FieldTypes.SELECT) {
                this.state[key] = userData[key] || 'unselected';
            } else if (ProfileFields[key] === FieldTypes.DATE) {
                this.state[key] = userData[key]
                    ? new Date(userData[key]).toISOString().split('T')[0]
                    : '';
            }
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handlePictureUpload = this.handlePictureUpload.bind(this);
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
                },
                dismissAfter: 5000
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.userState.data.form && nextProps.userState.data.user) {
            for (var i in nextProps.userState.data.user) {
                if (i in nextProps.userState.data.form) {
                    nextProps.userState.data.form[i].default =
                        nextProps.userState.data.user[i];
                }
            }
        }

        this.setState({
            userState: nextProps.userState
        });
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleFileUpload(file) {
        this.setState({
            resume: file
        });
    }

    handlePictureUpload(file) {
        this.setState({
            avatar: file
        });
    }

    onSubmit(e) {
        e.preventDefault();

        var profile = {};
        var files = {};

        if (this.state.resume) {
            files['resume'] = this.state.resume;
        }
        if (this.state.avatar) {
            files['avatar'] = this.state.avatar;
        }

        for (const key of Object.keys(ProfileFields)) {
            if (key === 'name') {
                profile[key] = this.state[key];
                profile['full_name'] = this.state[key];
            } else if (
                ProfileFields[key] === FieldTypes.TEXT ||
                ProfileFields[key] === FieldTypes.LINK ||
                ProfileFields[key] === FieldTypes.SELECT
            ) {
                profile[key] = this.state[key];
            } else if (ProfileFields[key] === FieldTypes.DATE) {
                profile[key] = new Date(this.state[key]).getTime();
            }
        }

        this.props.dispatch(ProfileThunks.updateProfile(profile, files));

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
                        You should have received a verification email at{' ' +
                            userData.user.email}. If not, you can request
                        another one by clicking{' '}
                        <Link
                            onClick={this.onClickRequestEmailVerification}
                            color={this.props.theme.highlight}
                        >
                            here
                        </Link>. After you verify your email you can continue
                        setting up your profile!
                    </p>
                </FullscreenColumnContainer>
            </PageContainer>
        );
    }

    render() {
        if (
            !this.state.userState ||
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
                                    message={
                                        'Your application is submitted but you can still make changes on the application page to update it! Thanks for applying to MHacks X'
                                    }
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
                            hidden={{ email: true, password: true }}
                            theme={this.props.theme}
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
                />
            </PageContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(EditProfile);
