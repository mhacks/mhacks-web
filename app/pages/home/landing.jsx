import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
// import { devices } from '../../styles';

import Apply from './apply.jsx';

// import Cover from 'react-video-cover';
const BackgroundVideo = require('../../../static/m13/background.mp4');
const LandingBackground = require('../../../static/m13/landing.png');
// const LandingLogo = require('../../../static/m12/logo-landing.png');

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
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
`;

// const Logo = styled.div`
//     height: auto;

//     ${devices.tiny`
//         width: 100vw;
//     `} ${devices.small`
//         width: 70vw;
//     `};
// `;

const ApplyBox = styled.div`
    width: 100%;
`;

const MLHBanner = styled.a`
    display: block;
    position: absolute;
    left: 2%;
    margin-top: 2%;
    width: 10%;
    max-width: 84px;
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
        // const videoOptions = {
        //     src: BackgroundVideo,
        //     autoPlay: true,
        //     muted: true,
        //     loop: false,
        //     playsInline: true
        // };

        return (
            <Wrapper>
                <MLHBanner
                    href="https://mlh.io/seasons/na-2021/events?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2021-season&utm_content=gray"
                    target="_blank"
                >
                    <MLHBannerImage
                        src="https://s3.amazonaws.com/logged-assets/trust-badge/2021/mlh-trust-badge-2021-gray.svg"
                        alt="Major League Hacking 2021 Hackathon Season"
                    />
                </MLHBanner>
                <Container style={{ height: '100vh' }}>
                    <img
                        src={LandingBackground}
                        style={{
                            zIndex: '2',
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <InnerContainer>
                        <video
                            src={BackgroundVideo}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                zIndex: '1',
                                maxHeight: '35vh',
                                maxWidth: '90vw',
                                height: 'auto',
                                width: 'auto'
                            }}
                        />
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
