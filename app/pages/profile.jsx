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
    constructor() {
        super();

        this.state = {
            birthday: '',
            university: '',
            focus: ''
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

        console.log('save profile');
    }

    render() {
        return (
            <Page>
                <FormContainer>
                    <SectionHeader color={this.props.theme.primary}>
                        {this.props.userState.data.user.isEmailVerified ? 'Profile' : 'Unverified Email'}
                    </SectionHeader>
                    {this.props.userState.data.user.isEmailVerified ?

                        <form onSubmit={this.onSubmit}>
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
                                        id="focus"
                                        type="text"
                                        name="focus"
                                        placeholder="Underwater Basket Weaving"
                                        value={this.state.focus}
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
