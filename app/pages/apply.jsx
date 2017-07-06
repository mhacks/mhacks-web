import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ProfileThunks, ApplicationThunks } from '../actions';
import { routes } from '../constants';
import {
    PageContainer,
    RoundedButton,
    FileUpload,
    Alert,
    LabeledInput
} from '../components';

const FormContainer = styled.div`
    maxWidth: 500px;
    margin: 0 auto;
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
    marginTop: 30px;
`;

const AlertContainer = styled.div`
    marginTop: 30px;
`;

const LegalText = styled.p`
    fontSize: 15px;
    color: gray;
`;

const LegalLink = styled.a`
    color: ${props => props.theme.teal};
    textDecoration: none;
`;

class Apply extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;

        this.state = {
            birthday: userData.birthday
                ? new Date(userData.birthday).toISOString().split('T')[0]
                : '',
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

    componentWillUpdate(nextProps) {
        if (nextProps.userState.data.isApplicationSubmitted) {
            this.context.router.history.push(routes.PROFILE);
        }
    }

    componentWillReceiveProps(nextProps) {
        const userData = this.props.userState.data.user;
        const nextUserData = nextProps.userState.data.user;

        if (nextProps.userState.fetching) {
            return;
        }

        if (
            userData.birthday !== nextUserData ||
            userData.university !== nextUserData.university ||
            userData.major !== nextUserData.major ||
            userData.isResumeUploaded !== nextUserData.isResumeUploaded
        ) {
            this.setState({
                birthday: nextUserData.birthday
                    ? new Date(nextUserData.birthday)
                          .toISOString()
                          .split('T')[0]
                    : '',
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

        const inputBirthday = new Date(this.state.birthday).getTime();

        application.birthday = inputBirthday;
        application.major = this.state.major;
        application.university = this.state.university;
        application.tshirt_size = this.state.tshirt;
        application.experience = this.state.hackathonExperience;

        if (this.state.resume) {
            files['resume'] = this.state.resume;
        }

        this.props.dispatch(
            ApplicationThunks.uploadApplication(application, files)
        );
    }

    render() {
        return (
            <PageContainer>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        Application
                    </SectionHeader>
                    <form onSubmit={this.onSubmit}>
                        {this.props.userState.error
                            ? <AlertContainer>
                                  <Alert
                                      message={this.props.userState.message}
                                  />
                              </AlertContainer>
                            : null}
                        <Flexer>
                            <InputContainer>
                                <LabeledInput label="Date of Birth">
                                    <input
                                        id="birthday"
                                        type="date"
                                        name="birthday"
                                        value={this.state.birthday}
                                        onChange={this.handleAttributeChange}
                                    />
                                </LabeledInput>
                                <LabeledInput label="University">
                                    <input
                                        id="university"
                                        type="text"
                                        name="university"
                                        placeholder="e.g. University of Michigan"
                                        value={this.state.university}
                                        onChange={this.handleAttributeChange}
                                    />
                                </LabeledInput>
                                <LabeledInput label="Major">
                                    <input
                                        id="major"
                                        type="text"
                                        name="major"
                                        placeholder="e.g. Underwater Basket Weaving"
                                        value={this.state.major}
                                        onChange={this.handleAttributeChange}
                                    />
                                </LabeledInput>
                                <LabeledInput label="T-Shirt Size">
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
                                </LabeledInput>
                                <LabeledInput label="Experience">
                                    <select
                                        name="hackathonExperience"
                                        value={this.state.hackathonExperience}
                                        onChange={this.handleAttributeChange}
                                    >
                                        <option value="novice">
                                            0-1 Hackathons (Novice)
                                        </option>
                                        <option value="experienced">
                                            2-5 Hackathons (Experienced)
                                        </option>
                                        <option value="veteran">
                                            6+ Hackathons (Veteran)
                                        </option>
                                    </select>
                                </LabeledInput>
                                <FileUploadContainer>
                                    <FileUpload
                                        defaultColor={
                                            this.props.userState.data.user
                                                .isResumeUploaded
                                                ? this.props.theme.success
                                                : this.props.theme.primary
                                        }
                                        hoverColor={this.props.theme.secondary}
                                        activeColor={this.props.theme.success}
                                        onFileSelect={this.handleFileUpload}
                                        defaultText={
                                            this.props.userState.data.user
                                                .isResumeUploaded
                                                ? 'Resume Uploaded'
                                                : null
                                        }
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
                            <LegalText>
                                By applying to MHacks Nano, you agree to the
                                MHacks{' '}
                                <LegalLink href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                    Code of Conduct
                                </LegalLink>.
                            </LegalText>
                        </Flexer>
                    </form>
                </FormContainer>
            </PageContainer>
        );
    }
}

Apply.contextTypes = {
    router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Apply);
