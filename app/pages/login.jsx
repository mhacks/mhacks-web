import React from 'react';
import styled from 'styled-components';
import { AuthThunks } from '../actions';
import { connect } from 'react-redux';
import { routes } from '../constants';

import { TabGroup, RoundedButton, Alert } from '../components';

/* Containers */
const Page = styled.div`
    margin: 80px auto 0 auto;
`;

const FormContainer = styled.div`
    width: 500px;
    max-width: calc(100% - 40px);
    min-height: calc(100vh - 30px - 2rem - 80px);
    padding: 20px 0 50px;
    margin: 0 auto;
`;

const Flexer = styled.div`
    display: flex;
    flex-direction: column;
`;

const InputContainer = styled.div`
    margin: 30px 0;

    input {
        width: 100%;
        margin: 10px 0;
        padding: 8px;
        font-size: 1em;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const AlertContainer = styled.div`
    margin-top: 30px;
`;

const LegalText = styled.p`
    font-size: 15px;
    color: gray;
`;

const LegalLink = styled.a`
    color: ${props => props.theme.highlight};
    text-decoration: none;
`;

/* Login Component */
class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
            email: '',
            password: '',
            isRegistering: true
        };

        this.tabSelect = this.tabSelect.bind(this);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.userState.data.isLoggedIn) {
            this.context.router.history.replace(routes.PROFILE);
        }
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.state.isRegistering) {
            this.props.dispatch(
                AuthThunks.register({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password
                })
            );
        } else {
            this.props.dispatch(
                AuthThunks.login({
                    email: this.state.email,
                    password: this.state.password
                })
            );
        }
    }

    tabSelect(index) {
        if (
            (this.state.isRegistering === true && index !== 0) ||
            (this.state.isRegistering === false && index !== 1)
        ) {
            this.setState({
                isRegistering: !this.state.isRegistering
            });
        }
    }

    render() {
        return (
            <Page>
                <FormContainer>
                    <TabGroup
                        tabs={[
                            {
                                title: 'Sign Up',
                                onClick: this.tabSelect
                            },
                            {
                                title: 'Log In',
                                onClick: this.tabSelect
                            }
                        ]}
                        primaryColor={this.props.theme.primary}
                    />
                    {this.props.userState.error ? (
                        <AlertContainer>
                            <Alert message={this.props.userState.message} />
                        </AlertContainer>
                    ) : null}
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <Flexer>
                            <InputContainer>
                                {this.state.isRegistering ? (
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Name (e.g. Hacker McHackerface)"
                                        value={this.state.name}
                                        onChange={this.handleAttributeChange.bind(
                                            this
                                        )}
                                    />
                                ) : (
                                    undefined
                                )}
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email (e.g. hacker@umich.edu)"
                                    value={this.state.email}
                                    onChange={this.handleAttributeChange.bind(
                                        this
                                    )}
                                />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password (e.g. hunter2)"
                                    value={this.state.password}
                                    onChange={this.handleAttributeChange.bind(
                                        this
                                    )}
                                />
                            </InputContainer>
                            <ButtonGroup>
                                <RoundedButton
                                    type="submit"
                                    color={this.props.theme.primary}
                                >
                                    Confirm
                                </RoundedButton>
                            </ButtonGroup>
                            {this.state.isRegistering ? (
                                <LegalText>
                                    By signing up for an MHacks account, you
                                    agree to the MHacks{' '}
                                    <LegalLink href="https://docs.google.com/document/d/11a34FHFftUKiN7DF3Fi_nTKCbiOXBbKTFwJfeqqZZmA/pub">
                                        Privacy Policy
                                    </LegalLink>{' '}
                                    and{' '}
                                    <LegalLink href="https://docs.google.com/document/d/1b-NwrHVRvct-1Fqx7QdjMWgERC1Isy8dHtE0q3v5tZA/pub">
                                        Terms of Service
                                    </LegalLink>.
                                </LegalText>
                            ) : (
                                undefined
                            )}
                        </Flexer>
                    </form>
                </FormContainer>
            </Page>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Login);
