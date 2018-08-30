import React from 'react';
import styled from 'styled-components';

import { devices } from '../../styles';
import { Container, VideoPlayer } from '../../components';
import { SubscribeThunks } from '../../actions';
import { connect } from 'react-redux';
import VideoPlaceholderImage from '../../../static/blackout/video-placeholder.png';

const Wrapper = styled.div`
    background: white;
    margin: 0 20px;
    text-align: center;
`;

const HeroContainer = styled.div`
    padding: 20px 0;
    margin: 0 20px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    overflow: visible;
    background: white;

    ${devices.desktop`
        padding: 75px 0;
        flex-direction: row;
        align-items: center;
    `};
`;

const LeftSideContainer = styled.div`
    order: -1;
    ${devices.desktop`
        width: 60%;
        float: left;
    `};
`;

const Text = styled.h2`
    font-size: 42px;
    font-weight: 900;
    margin-bottom: 0;
    text-align: center;
    ${devices.desktop`
        font-size: 42px;
        margin: -50px 15px 25px 0;
        text-align: left;
    `};
`;

const SubText = styled.h2`
    font-size: 14px;
    text-align: left;
    line-height: 35px;
    ${devices.desktop`
        font-size: 18px;
        margin: 0px 15px 25px 0;
    `};
`;

const VideoPlayerContainer = styled.div`
    position: relative;
    ${devices.desktop`
        width: 60%;
        float: right;
    `};
`;

class HomeHero extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            feedback: ''
        };

        this.emailChange = this.emailChange.bind(this);
        this.submitEmail = this.submitEmail.bind(this);
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
            <Wrapper>
                <Container>
                    <HeroContainer>
                        <VideoPlayerContainer>
                            <VideoPlayer
                                placeholderImage={VideoPlaceholderImage}
                                videoUrl="https://www.youtube.com/embed/bTC2oPnJ4Zo"
                                showControls={false}
                                showVideoDetails={false}
                                autoplay={true}
                            />
                        </VideoPlayerContainer>
                        <LeftSideContainer>
                            <Text>Welcome to MHacks 11</Text>
                            <SubText>
                                MHacks is a 36-hour hackathon run by University
                                of Michigan students. At MHacks, we want to help
                                you turn your ideas into reality. You're welcome
                                to come with or without a team. We'll provide
                                you with all the resources you need to help you
                                work on something cool or learn new skills.
                                You'll have the freedom to create a product and
                                have fun working on a project with friends. For
                                newcomers and veterans alike, MHacks is an
                                experience you won’t want to miss.
                            </SubText>
                        </LeftSideContainer>
                    </HeroContainer>
                </Container>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        status: state.subscribeState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(HomeHero);
