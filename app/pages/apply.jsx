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

class Apply extends React.Component {
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

        const userData = this.props.userState.data.user;
        var profile = {};

        const inputBirthday = new Date(this.state.birthday);

        if (inputBirthday && inputBirthday !== userData.birthday) {
            profile.birthday = inputBirthday;
        }

        if (this.state.major !== userData.major) {
            profile.major = this.state.major;
        }

        if (this.state.university !== userData.university) {
            profile.university = this.state.university;
        }

        this.props.dispatch(ProfileThunks.updateProfile(profile));
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
                        <p>Update your profile with some info about yourself. This will be automatically populated into your application and persist through hackathons!</p>
                        <Flexer>
                            <InputContainer>
                                <Input
                                    id="birthday"
                                    type="date"
                                    name="birthday"
                                    placeholder="Birthday (e.g. 01/01/1970)"
                                    value={this.state.birthday}
                                    onChange={this.handleAttributeChange}
                                />
                                <Input
                                    id="university"
                                    type="text"
                                    name="university"
                                    placeholder="School (e.g. University of Michigan)"
                                    value={this.state.university}
                                    onChange={this.handleAttributeChange}
                                />
                                <Input
                                    id="major"
                                    type="text"
                                    name="major"
                                    placeholder="Area of Study (e.g. Underwater Basket Weaving)"
                                    value={this.state.major}
                                    onChange={this.handleAttributeChange}
                                />
                                <select name="tshirt">
                                    <option value="" disabled selected hidden>Shirt Size</option>
                                    <option value="xs">XS</option>
                                    <option value="s">S</option>
                                    <option value="m">M</option>
                                    <option value="l">L</option>
                                    <option value="xl">XL</option>
                                    <option value="2xl">2XL</option>
                                    <option value="3xl">3XL</option>
                                </select>
                                <Input
                                    id="major"
                                    type="text"
                                    name="major"
                                    placeholder="Area of Study (e.g. Underwater Basket Weaving)"
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
