import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks } from '../actions';

import { PageContainer, RoundedButton, FileUpload, Alert, LabeledInput } from '../components';

const FormContainer = styled.div`
    maxWidth: 500px;
    margin: 0 auto;
`;

const Flexer = styled.div`
    display: flex;
    flexDirection: column;
`;

const InputContainer = styled.div`
    marginBottom: 30px;
`;

const ButtonGroup = styled.div`
    display: flex;
    flexDirection: row;
    justifyContent: space-between;
`;

const SectionHeader = styled.h2`
    fontSize: 40px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 0;
`;

const FileUploadContainer = styled.div`
    marginTop: 30px;
`;

const AlertContainer = styled.div`
    marginTop: 30px;
`;

const Subhead = styled.p`
    margin: 20px 0 0 0;
`;

const Link = styled.a`
    color: ${props => props.color};
    cursor: pointer;
`;

class Profile extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;

        this.state = {
            birthday: userData.birthday ? new Date(userData.birthday).toISOString().split('T')[0] : '',
            university: userData.university || '',
            major: userData.major || '',
            avatars: userData.avatars || [],
            isResumeUploaded: userData.isResumeUploaded || false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.onClickRequestEmailVerification = this.onClickRequestEmailVerification.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ProfileThunks.loadProfile());
    }

    componentWillReceiveProps(nextProps) {
        const userData = this.props.userState.data.user;
        const nextUserData = nextProps.userState.data.user;

        if (nextProps.userState.fetching) {
            return;
        }

        if (userData.birthday !== nextUserData ||
            userData.university !== nextUserData.university ||
            userData.major !== nextUserData.major ||
            userData.isResumeUploaded !== nextUserData.isResumeUploaded) {
                this.setState({
                    birthday: nextUserData.birthday ? new Date(nextUserData.birthday).toISOString().split('T')[0] : '',
                    university: nextUserData.university || '',
                    major: nextUserData.major || '',
                    isResumeUploaded: userData.isResumeUploaded || false
                });
            }
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

    onSubmit(e) {
        e.preventDefault();

        var profile = {};
        var files = {};

        const inputBirthday = (new Date(this.state.birthday)).getTime();

        profile.birthday = inputBirthday;
        profile.major = this.state.major;
        profile.university = this.state.university;

        if (this.state.resume) {
            files['resume'] = this.state.resume;
        }

        this.props.dispatch(ProfileThunks.updateProfile(profile, files));
    }

    onClickRequestEmailVerification(e) {
        e.preventDefault();

        var email = this.props.userState.data.user.email;

        this.props.dispatch(ProfileThunks.sendVerificationEmail(email));
    }

    render() {
        return (
            <PageContainer>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        {this.props.userState.data.isEmailVerified ? 'Profile' : 'Unverified Email'}
                    </SectionHeader>
                    {this.props.userState.data.isEmailVerified ?
                        <form onSubmit={this.onSubmit}>
                            {this.props.userState.error ?
                                <AlertContainer>
                                    <Alert message={this.props.userState.message} />
                                </AlertContainer> :
                                null
                            }
                            {this.props.userState.data.isApplicationSubmitted ?
                                <AlertContainer>
                                    <Alert
                                        message={'Your application is submitted! Thanks for applying to MHacks Nano'}
                                    />
                                </AlertContainer> :
                                null
                            }
                            <Subhead>Update your profile with some info about yourself. This will be automatically populated into your application and persist through hackathons!</Subhead>
                            <Flexer>
                                <InputContainer>
                                    <LabeledInput
                                        label="Date of Birth"
                                    >
                                        <input
                                            id="birthday"
                                            type="date"
                                            name="birthday"
                                            placeholder="mm/dd/yyyy"
                                            value={this.state.birthday}
                                            onChange={this.handleAttributeChange}
                                        />
                                    </LabeledInput>
                                    <LabeledInput
                                        label="University"
                                    >
                                        <input
                                            id="university"
                                            type="text"
                                            name="university"
                                            placeholder="e.g. University of Michigan"
                                            value={this.state.university}
                                            onChange={this.handleAttributeChange}
                                        />
                                    </LabeledInput>
                                    <LabeledInput
                                        label="Major"
                                    >
                                        <input
                                            id="major"
                                            type="text"
                                            name="major"
                                            placeholder="e.g. Underwater Basket Weaving"
                                            value={this.state.major}
                                            onChange={this.handleAttributeChange}
                                        />
                                    </LabeledInput>
                                    <FileUploadContainer>
                                        <FileUpload
                                            defaultColor={this.props.userState.data.user.isResumeUploaded ? this.props.theme.success : this.props.theme.primary}
                                            hoverColor={this.props.theme.secondary}
                                            activeColor={this.props.theme.success}
                                            onFileSelect={this.handleFileUpload}
                                            defaultText={this.props.userState.data.user.isResumeUploaded ? 'Resume Uploaded' : null}
                                        />
                                    </FileUploadContainer>
                                </InputContainer>
                                <ButtonGroup>
                                    <RoundedButton
                                        type="submit"
                                        color={this.props.theme.primary}
                                    >
                                    Save
                                    </RoundedButton>
                                </ButtonGroup>
                            </Flexer>
                        </form> :
                        <p>You should have received a verification email at {this.props.userState.data.email}. If not, you can request another one <Link onClick={this.onClickRequestEmailVerification} color={this.props.theme.primary}>here</Link>. After you verify your email you can continue setting up your profile!</p>
                    }
                </FormContainer>
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

export default connect(mapStateToProps)(Profile);
