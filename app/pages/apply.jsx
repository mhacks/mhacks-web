import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks, ApplicationThunks } from '../actions';

import { RoundedButton, FileUpload, Alert } from '../components';

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

const InputField = styled.div`
    width: 100%;
    margin: 10px 0;
    display: flex;
    justifyContent: space-between;

    p {
        width: 160px;
    }

    select {
        background: none;
        borderColor: rgb(215, 215, 215);
        marginLeft: 30px;
        flexGrow: 1;
    }

    input {
        marginLeft: 30px;
        paddingLeft: 10px;
        flexGrow: 1;
    }
`;

const AlertContainer = styled.div`
    marginTop: 30px;
`;

class Apply extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;

        this.state = {
            birthday: userData.birthday ? new Date(userData.birthday).toISOString().split('T')[0] : '',
            university: userData.university || '',
            major: userData.major || '',
            isResumeUploaded: userData.isResumeUploaded || false,
            tshirt: userData.tshirt || 'm',
            hackathonExperience: userData.hackathonExperience || 'novice',
            resume: null
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

        var application = {};
        var files = {};

        const inputBirthday = new Date(this.state.birthday);

        application.birthday = inputBirthday;
        application.major = this.state.major;
        application.university = this.state.university;
        application.tshirt = this.state.tshirt;
        application.hackathonExperience = this.state.hackathonExperience;

        if (this.state.resume) {
            files['resume'] = this.state.resume;
        }

        this.props.dispatch(ApplicationThunks.uploadApplication(application, files));
    }

    render() {
        return (
            <Page>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Application
                    </SectionHeader>
                    <form onSubmit={this.onSubmit}>
                        {this.props.userState.error ?
                            <AlertContainer>
                                <Alert message={this.props.userState.message} />
                            </AlertContainer> :
                            null
                        }
                        <Flexer>
                            <InputContainer>
                                <InputField>
                                    <p>Date of Birth</p>
                                    <input
                                        id="birthday"
                                        type="date"
                                        name="birthday"
                                        placeholder="01/01/1970"
                                        value={this.state.birthday}
                                        onChange={this.handleAttributeChange}
                                    />
                                </InputField>
                                <InputField>
                                    <p>University</p>
                                    <input
                                        id="university"
                                        type="text"
                                        name="university"
                                        placeholder="University of Michigan"
                                        value={this.state.university}
                                        onChange={this.handleAttributeChange}
                                    />
                                </InputField>
                                <InputField>
                                    <p>Major</p>
                                    <input
                                        id="major"
                                        type="text"
                                        name="major"
                                        placeholder="Underwater Basket Weaving"
                                        value={this.state.major}
                                        onChange={this.handleAttributeChange}
                                    />
                                </InputField>
                                <InputField>
                                    <p>T-Shirt Size</p>
                                    <select
                                        name="tshirt"
                                        value={this.state.tshirt}
                                        onChange={this.handleAttributeChange}
                                    >
                                        <option value="xs">XS</option>
                                        <option value="s">S</option>
                                        <option value="m">M</option>
                                        <option value="l">L</option>
                                        <option value="xl">XL</option>
                                        <option value="2xl">2XL</option>
                                        <option value="3xl">3XL</option>
                                    </select>
                                </InputField>
                                <InputField>
                                    <p>Hackathons Attended</p>
                                    <select
                                        name="hackathonExperience"
                                        value={this.state.hackathonExperience}
                                        onChange={this.handleAttributeChange}
                                    >
                                        <option value="novice">0-1 (Novice)</option>
                                        <option value="experienced">2-5 (Experienced)</option>
                                        <option value="veteran">6+ (Veteran)</option>
                                    </select>
                                </InputField>
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
                                Submit
                                </RoundedButton>
                            </ButtonGroup>
                        </Flexer>
                    </form>
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

export default connect(mapStateToProps)(Apply);
