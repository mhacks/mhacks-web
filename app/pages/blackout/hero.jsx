import React from 'react';
import styled from 'styled-components';

import { devices } from '../../styles';
import { TextSubmit, Container, VideoPlayer } from '../../components';
import { SubscribeThunks } from '../../actions';
import { routes } from '../../constants';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import VideoPlaceholderImage from '../../../static/blackout/video-placeholder.png';

const HeroContainer = styled.div`
    padding: 20px 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    overflow: visible;

    ${devices.desktop`
        padding: 75px 0;
        flex-direction: row;
        align-items: center;
    `};
`;

const LeftSideContainer = styled.div`
    order: -1;
    ${devices.desktop`
        width: calc(40% - 20px);
        float: left;
    `};
`;

const TextSubmitPositioner = styled.div`
    margin-bottom: 20px;
    text-align: center;
    ${devices.desktop`
        position: absolute;
        margin: 0;
        width: 425px;
    `};
`;

const Text = styled.h2`
    font-size: 22px;
    margin-bottom: 0;
    text-align: center;
    ${devices.desktop`
        font-size: 28px;
        margin: -50px 15px 25px 0;
        text-align: left;
    `};
`;

const VideoPlayerContainer = styled.div`
    position: relative;
    ${devices.desktop`
        width: 60%;
        float: right;
    `};
`;

const Orb = styled.div`
    width: 30%;
    height: 30%;
    filter: blur(50px);
    border-radius: 80px;
    position: absolute;
    display: none;

    ${devices.desktop`
        display: block;
    `};
`;

const PinkOrb = styled(Orb)`
    background-color: ${props => props.theme.pink};
    top: 0;
    right: 20%;
`;

const TealOrb = styled(Orb)`
    background-color: ${props => props.theme.teal};
    bottom: -10%;
    left: 20%;
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
                    <VideoPlayerContainer>
                        <TealOrb />
                        <PinkOrb />
                        <VideoPlayer
                            placeholderImage={VideoPlaceholderImage}
                            videoUrl="https://www.youtube.com/embed/bTC2oPnJ4Zo"
                            showControls={false}
                            showVideoDetails={false}
                            autoplay={true}
                        />
                    </VideoPlayerContainer>
                    <LeftSideContainer>
                        <Text>
                            MHacks helps you turn your dreams into reality.
                        </Text>
                        <TextSubmitPositioner>
                            <TextSubmit
                                primaryColor={this.props.theme.teal}
                                secondaryColor="white"
                                feedbackColor="white"
                                placeholder="ENTER YOUR EMAIL"
                                feedback={this.props.status.message}
                                buttonText="Subscribe"
                                value={this.state.email}
                                onChange={e => {
                                    this.emailChange(e);
                                }}
                                onSubmit={this.submitEmail}
                            />
                        </TextSubmitPositioner>
                    </LeftSideContainer>
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
