import React from 'react';
import styled from 'styled-components';
import { AuthThunks } from '../actions';
import { connect } from 'react-redux';
import { routes } from '../constants';

import { RoundedButton, Alert } from '../components';
import { replace, push } from 'connected-react-router';

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

/* Reset Component */
class PasswordReset extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: ''
        };
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.userState.data.isLoggedIn) {
            this.props.dispatch(replace(routes.PROFILE));
        }
        return true;
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

        this.props.dispatch(
            AuthThunks.resetToken(
                {
                    password: this.state.password
                },
                window.location.href.split('/').pop()
            )
        );
    }

    render() {
        if (!this.props.userState.error && this.props.userState.message) {
            this.props.dispatch(push(routes.LOGIN));
            return null;
        }

        return (
            <Page>
                <FormContainer>
                    {this.props.userState.error ? (
                        <AlertContainer>
                            <Alert message={this.props.userState.message} />
                        </AlertContainer>
                    ) : null}
                    {!this.props.userState.error &&
                    this.props.userState.message ? (
                        <AlertContainer>
                            <Alert
                                message={this.props.userState.message}
                                positive={true}
                            />
                        </AlertContainer>
                    ) : null}
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <Flexer>
                            <InputContainer>
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

export default connect(mapStateToProps)(PasswordReset);
