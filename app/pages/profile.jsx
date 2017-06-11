import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks } from '../actions';

import { RoundedButton, FileUpload } from '../components';

/* Containers */
const Page = styled.div`
    display: flex;
    alignItems: center;
    justifyContent: center;
    height: 100vh;
`;

const FormContainer = styled.div`
    width: 500px;
    maxWidth: calc(100% - 40px);
    margin: 40px auto;
`;

const Flexer = styled.div`
    display: flex;
    flexDirection: column;
`;

const InputContainer = styled.div`
    margin: 20px 0 30px 0;
`;

const Input = styled.input`
    width: 100%;
    margin: 10px 0;
    padding: 8px;
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
    marginTop: 10px;
`;

class Profile extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;

        this.state = {
            birthday: userData.birthday ? new Date(userData.birthday).toISOString().split('T')[0] : '',
            university: userData.university || '',
            major: userData.major || ''
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ProfileThunks.loadProfile());
    }

    componentWillReceiveProps(nextProps) {
        const userData = this.props.userState.data.user;
        const nextUserData = nextProps.userState.data.user;

        if (userData.birthday !== nextUserData ||
            userData.university !== nextUserData.university ||
            userData.major !== nextUserData.major) {
                this.setState({
                    birthday: nextUserData.birthday ? new Date(nextUserData.birthday).toISOString().split('T')[0] : '',
                    university: nextUserData.university || '',
                    major: nextUserData.major || ''
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

        const inputBirthday = new Date(this.state.birthday);

        profile.birthday = inputBirthday;
        profile.major = this.state.major;
        profile.university = this.state.university;

        if (this.state.resume) {
            files['resume'] = this.state.resume;
        }

        this.props.dispatch(ProfileThunks.updateProfile(profile, files));
    }

    render() {
        return (
            <Page>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        {this.props.userState.data.isEmailVerified ? 'Profile' : 'Unverified Email'}
                    </SectionHeader>
                    {this.props.userState.data.isEmailVerified ?
                        <form onSubmit={this.onSubmit}>
                            <p>Update your profile with some info about yourself. This will be automatically populated into your application and persist through hackathons!</p>
                            <Flexer>
                                <InputContainer>
                                    <Input
                                        id="birthday"
                                        type="date"
                                        name="birthday"
                                        placeholder="01/01/1970"
                                        value={this.state.birthday}
                                        onChange={this.handleAttributeChange}
                                    />
                                    <Input
                                        id="university"
                                        type="text"
                                        name="university"
                                        placeholder="University of Michigan"
                                        value={this.state.university}
                                        onChange={this.handleAttributeChange}
                                    />
                                    <Input
                                        id="major"
                                        type="text"
                                        name="major"
                                        placeholder="Underwater Basket Weaving"
                                        value={this.state.major}
                                        onChange={this.handleAttributeChange}
                                    />
                                    <FileUploadContainer>
                                        <FileUpload
                                            defaultColor={this.props.theme.primary}
                                            hoverColor={this.props.theme.secondary}
                                            activeColor={this.props.theme.success}
                                            onFileSelect={this.handleFileUpload}
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
                        <p>You should receive a verification email at {this.props.userState.data.email}. After you verify your email you can continue setting up your profile!</p>
                    }
                </FormContainer>
            </Page>
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
