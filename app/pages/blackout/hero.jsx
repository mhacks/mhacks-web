import React from 'react';
import styled from 'styled-components';

import { devices } from '../../styles';
import { TextSubmit, Container, VideoPlayer } from '../../components';
import { SubscribeThunks } from '../../actions';
import { routes } from '../../constants';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const VideoPlaceholderImage = require('../../../static/blackout/video-placeholder.png');

/*
const HeaderWrapper = styled.div`
    display: flex;
    height: 90px;
    alignItems: center;
    justifyContent: center;
`;

const HeaderLogoWrapper = styled.div`
    display: flex;
    alignItems: center;
    height: 90%;
`;
*/

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

const VideoPlayerContainer = styled.div`
    ${devices.desktop`
        width: 60%;
        float: right;
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
                            <TextSubmit
                                placeholder="your@email.com"
                                buttonText="Subscribe"
                                focusColor="#350044"
                                baseColor="#E6E6E6"
                                feedback={this.props.status.message}
                                value={this.state.email}
                                onChange={e => {
                                    this.emailChange(e);
                                }}
                                onSubmit={this.submitEmail}
                            />
                        </TextSubmitPositioner>
                    </LeftSideContainer>
                    <VideoPlayerContainer>
                        <VideoPlayer
                            placeholderImage={VideoPlaceholderImage}
                            videoUrl="https://www.youtube.com/embed/FcZhyLZlIA8"
                            showControls={false}
                            showVideoDetails={false}
                            autoplay={true}
                        />
                    </VideoPlayerContainer>
                </HeroContainer>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        status: state.subscribeState
    };
}

export default connect(mapStateToProps)(BlackoutHero);
