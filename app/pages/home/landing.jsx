import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Apply from './apply.jsx';

import Cover from 'react-video-cover';
const BackgroundVideo = require('../../../static/m12/background-video.mp4');
const LandingLogo = require('../../../static/m12/logo-landing.png');

const Wrapper = styled.div`
    background: ${props => props.theme.primary};
    padding-top: 80px;
    z-index: 98;
    margin-bottom: 20px;
`;

const Container = styled.div`
    height: 100vh;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
`;

const InnerContainer = styled.div`
    position: absolute;
    height: 75vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;

const Logo = styled.div`
    height: 45vh;
    width: auto;
`;

const ApplyBox = styled.div`
    width: 100%;
`;

const MLHBanner = styled.a`
    display: block;
    position: absolute;
    left: 2%;
    margin-top: 2%;
    width: 10%;
    z-index: 99;
`;

const MLHBannerImage = styled.img`
    width: 100%;
    max-width: 84px;
`;

class Landing extends React.Component {
    constructor() {
        super();

        this.state = {
            resizeNotifier: () => {}
        };
    }

    render() {
        const videoOptions = {
            src: BackgroundVideo,
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true
        };

        return (
            <Wrapper>
                <MLHBanner
                    href="https://mlh.io/seasons/na-2019/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2019-season&utm_content=gray"
                    target="_blank"
                >
                    <MLHBannerImage
                        src="https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-gray.svg"
                        alt="Major League Hacking 2019 Hackathon Season"
                    />
                </MLHBanner>
                <Container>
                    <Cover
                        videoOptions={videoOptions}
                        remeasureOnWindowResize
                        getResizeNotifier={resizeNotifier => {
                            this.setState({
                                resizeNotifier
                            });
                        }}
                    />
                    <InnerContainer>
                        <Logo>
                            <img src={LandingLogo} style={{ height: '100%' }} />
                        </Logo>
                        <ApplyBox>
                            <Apply />
                        </ApplyBox>
                    </InnerContainer>
                </Container>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        configurationState: state.configurationState
    };
}

export default connect(mapStateToProps)(Landing);
