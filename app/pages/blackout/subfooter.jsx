import React from 'react';
import styled from 'styled-components';

import { InputText, Container } from '../../components';
import { devices } from '../../styles';
import { push } from 'react-router-redux';
import { routes } from '../../constants';
import { SubscribeThanks } from '../../actions';


const Flexer = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    justifyContent: center;
    minWidth: 100%;

    ${devices.tablet`
        textAlign: left;
        minWidth: 0;

        ${props => (props.right ? 'justifyContent: flex-end;' : '')}
    `}    
`;

const TextSubmitPositioner = styled.div`
    marginBottom: 20px;
    textAlign: center;
    ${devices.desktop`
        position: absolute;
        margin: 0;
        width: 400px;
    `}
`;

const Text = styled.h2`
    fontSize: 22px;
    marginBottom: 0;
    textAlign: center;
    ${devices.desktop`
        fontSize: 28px;
        margin: -50px 15px 25px 0;
        textAlign: left;
    `}
`;

const StyledInput = styled(InputText)`
    width: 500px;
`;

class BlackoutSub extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            feedback: ''
        };
        this.emailChange = this.emailChange.bind(this);
        this.submitEmail = this.submitEmail.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(push(routes.SUBSCRIBE));
    }

    emailChange(e) {
        this.setState({
            email: e.target.value
        });
    }

    submitEmail() {
        this.props.dispatch(SubscribeThanks.subscribe(this.state.email));
        this.setState({ email: '' });
    }

    render() {
        return (
            <Container>
                <Flexer>
                    <Text> Turn your ideas into reality. </Text>
                    <TextSubmitPositioner>
                            <StyledInput
                                color={this.props.theme.darkPink}
                                borderColor="white"
                                placeholder="ENTER YOUR EMAIL FOR UPDATES"
                                placeholderColor={this.props.theme.darkPink}
                                feedbackColor="white"
                                feedback={this.props.status.message}
                                value={this.state.email}
                                onChange={e => {
                                    this.emailChange(e);
                                }}
                                onSubmit={this.submitEmail}
                            />
                    </TextSubmitPositioner>
                </Flexer>
            </Container>
        );
    }
}

export default BlackoutSub;
