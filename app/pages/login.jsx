import React from 'react';
import styled from 'styled-components';
import { AuthThunks } from '../actions';
import { connect } from 'react-redux';
import { routes } from '../constants';

import { TabGroup, RoundedButton } from '../components';

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
    margin: 30px 0;

    input {
        width: 100%;
        margin: 10px 0;
        padding: 8px;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    flexDirection: row;
    justifyContent: space-between;
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
        if (nextProps.authState.data.isLoggedIn) {
            this.props.history.push(routes.SUBSCRIBE);
        }
    }

    // Generic function for changing state
    // -- input using this must have a name attribute
    handleAttributeChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.state.isRegistering) {
            this.props.dispatch(AuthThunks.register({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }));
        } else {
            this.props.dispatch(AuthThunks.login({
                email: this.state.email,
                password: this.state.password
            }));
        }
    }

    tabSelect(index) {
        if (this.state.isRegistering === true && index !== 0 ||
            this.state.isRegistering === false && index !== 1) {
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
                        tabs={[{
                            title: 'Sign Up',
                            onClick: this.tabSelect
                        }, {
                            title: 'Log In',
                            onClick: this.tabSelect
                        }]}
                        primaryColor={this.props.theme.primary}
                    />
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <Flexer>
                            <InputContainer>
                                {this.state.isRegistering ?
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Hacker mcHackerface"
                                        value={this.state.name}
                                        onChange={this.handleAttributeChange.bind(this)}
                                    /> :
                                    undefined
                                }
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="hacker@umich.edu"
                                    value={this.state.email}
                                    onChange={this.handleAttributeChange.bind(this)}
                                />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="hunter2"
                                    value={this.state.password}
                                    onChange={this.handleAttributeChange.bind(this)}
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
        authState: state.authState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Login);
