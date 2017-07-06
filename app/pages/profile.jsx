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
    marginBottom: 30px;
`;

const SectionHeader = styled.h2`
    fontSize: 40px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 0;
`;

const SubsectionHeader = styled.h3`
    fontSize: 22px;
    color: ${props => props.color};
    fontWeight: 500;
    margin: 26px 0 0 0;
`;

const FileUploadContainer = styled.div`
    marginTop: 10px;
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

const Types = {
    TEXT: 0,
    LINK: 1,
    DATE: 2,
    SELECT: 3
};

const fields = {
    name: Types.TEXT,
    university: Types.TEXT,
    major: Types.TEXT,
    github: Types.LINK,
    linkedin: Types.LINK,
    devpost: Types.LINK,
    portfolio: Types.LINK,
    tshirt: Types.SELECT,
    race: Types.SELECT,
    sex: Types.SELECT,
    birthday: Types.DATE
};

class Profile extends React.Component {
    constructor(props) {
        super(props);

        const userData = this.props.userState.data.user;

        this.state = {
            avatars: userData.avatars || [],
            isResumeUploaded: userData.isResumeUploaded || false
        };

        for (const key of Object.keys(fields)) {
            if (fields[key] === Types.TEXT || fields[key] === Types.LINK) {
                this.state[key] = userData[key] || '';
            } else if (fields[key] === Types.SELECT) {
                this.state[key] = userData[key] || 'unselected';
            } else if (fields[key] === Types.DATE) {
                this.state[key] = userData[key] ? new Date(userData[key]).toISOString().split('T')[0] : ''
            }
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.onClickRequestEmailVerification = this.onClickRequestEmailVerification.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(ProfileThunks.loadProfile());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userState.fetching) {
            return;
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

        if (this.state.resume) {
            files['resume'] = this.state.resume;
        }

        for (const key of Object.keys(fields)) {
            if (fields[key] === Types.TEXT || fields[key] === Types.LINK || fields[key] === Types.SELECT) {
                profile[key] = this.state[key];
            } else if (fields[key] === Types.DATE) {
                profile[key] = (new Date(this.state[key])).getTime();
            }
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
                                    <SubsectionHeader color={this.props.theme.primary}>
                                        General
                                    </SubsectionHeader>
                                    <LabeledInput
                                        label="Name"
                                    >
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="Hack mcHacker"
                                            value={this.state.name}
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
                                    <SubsectionHeader color={this.props.theme.primary}>
                                        Links
                                    </SubsectionHeader>
                                    <LabeledInput
                                        label="GitHub"
                                    >
                                        <input
                                            id="github"
                                            type="text"
                                            name="github"
                                            placeholder="https://github.com/"
                                            value={this.state.github}
                                            onChange={this.handleAttributeChange}
                                        />
                                    </LabeledInput>
                                    <LabeledInput
                                        label="LinkedIn"
                                    >
                                        <input
                                            id="linkedin"
                                            type="text"
                                            name="linkedin"
                                            placeholder="https://www.linkedin.com/in/"
                                            value={this.state.linkedin}
                                            onChange={this.handleAttributeChange}
                                        />
                                    </LabeledInput>
                                    <LabeledInput
                                        label="DevPost"
                                    >
                                        <input
                                            id="devpost"
                                            type="text"
                                            name="devpost"
                                            placeholder="https://devpost.com/"
                                            value={this.state.devpost}
                                            onChange={this.handleAttributeChange}
                                        />
                                    </LabeledInput>
                                    <LabeledInput
                                        label="Portfolio"
                                    >
                                        <input
                                            id="portfolio"
                                            type="text"
                                            name="portfolio"
                                            placeholder="https://"
                                            value={this.state.portfolio}
                                            onChange={this.handleAttributeChange}
                                        />
                                    </LabeledInput>
                                    <SubsectionHeader color={this.props.theme.primary}>
                                        Private
                                    </SubsectionHeader>
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
                                        label="T-Shirt Size"
                                    >
                                        <select
                                            name="tshirt"
                                            value={this.state.tshirt}
                                            onChange={this.handleAttributeChange}
                                        >
                                            <option value="unselected">Select</option>
                                            <option value="xs">XS</option>
                                            <option value="s">S</option>
                                            <option value="m">M</option>
                                            <option value="l">L</option>
                                            <option value="xl">XL</option>
                                            <option value="2xl">2XL</option>
                                            <option value="3xl">3XL</option>
                                        </select>
                                    </LabeledInput>
                                    <LabeledInput
                                        label="Race"
                                    >
                                        <select
                                            name="race"
                                            value={this.state.race}
                                            onChange={this.handleAttributeChange}
                                        >
                                            <option value="unselected">Select</option>
                                            <option value="white">White</option>
                                            <option value="black">Black</option>
                                            <option value="am-indian-alaskan">American Indian or Alaskan Native</option>
                                            <option value="asian">Asian or Pacific Islander</option>
                                            <option value="hispanic">Hispanic</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not">Prefer not to answer</option>
                                        </select>
                                    </LabeledInput>
                                    <LabeledInput
                                        label="Sex"
                                    >
                                        <select
                                            name="sex"
                                            value={this.state.sex}
                                            onChange={this.handleAttributeChange}
                                        >
                                            <option value="unselected">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="non-binary">Non Binary</option>
                                            <option value="prefer-not">Prefer not to answer</option>
                                        </select>
                                    </LabeledInput>
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
