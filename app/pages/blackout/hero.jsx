import React from 'react';
import styled from 'styled-components';

import { devices } from '../../styles';
import { InputText, Container } from '../../components';
import { SubscribeThunks } from '../../actions';
import { routes } from '../../constants';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const VideoPlaceholderImage = require('../../../static/blackout/video-placeholder.png');

const HeroContainer = styled.div`
    overflow: auto;
    display: flex;
    flexDirection: column;

    ${devices.desktop`
        flexDirection: row;
        alignItems: center;
    `}
`;
const LeftSideContainer = styled.div`
    ${devices.desktop`
        width: calc(40% - 20px);
        float: left;
    `}
`;

const VideoPlaceholderContainer = styled.div`
    ${devices.desktop`
        width: 60%;
        float: right;
    `}
`;

const VideoPlaceholder = styled.img`
    width: 100%;
    height: auto;
`;

const TextSubmitPositioner = styled.div`
    marginBottom: 20px;
    textAlign: center;
    ${devices.desktop`
        position: absolute;
        margin: 0;
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

class BlackoutHero extends React.Component {
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
        this.props.dispatch(SubscribeThunks.subscribe(this.state.email));
        this.setState({ email: '' });
    }

    render() {
        return (
            <Container>
                <HeroContainer>
                    <LeftSideContainer>
                        <Text>MHacks helps you turn your dreams into reality.</Text>
                        <TextSubmitPositioner>
                            <InputText
                                color={this.props.theme.darkPink}
                                borderColor="white"
                                placeholder="ENTER YOUR EMAIL FOR UPDATES"
                                placeholderColor={this.props.theme.darkPink}
                                feedbackColor="white"
                                width="400px"
                                feedback={this.props.status.message}
                                value={this.state.email}
                                onChange={e => {
                                    this.emailChange(e);
                                }}
                                onSubmit={this.submitEmail}
                            />
                        </TextSubmitPositioner>
                    </LeftSideContainer>
                    <VideoPlaceholderContainer>
                        <VideoPlaceholder src={VideoPlaceholderImage} />
                    </VideoPlaceholderContainer>
                </HeroContainer>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        status: state.subscribeState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(BlackoutHero);
