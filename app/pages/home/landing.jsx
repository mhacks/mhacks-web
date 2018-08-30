import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { devices } from '../../styles';

const Wrapper = styled.div`
    background: ${props => props.theme.primary};
    padding-top: 80px;
    z-index: 98;
`;

const Container = styled.div`
    height: 100%;
    width: calc(100% - 60px);
    max-width: 1200px;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ${devices.tiny`
        margin-top: 160px;
    `} ${devices.tablet`
        width: calc(100% - 100px);
    `} ${devices.desktop`
        width: calc(100% - 140px);
    `} ${devices.giant`
        width: calc(100% - 160px);
    `};
`;

const LogoText = styled.div`
    position: relative;
    height: auto;
    width: auto;
    font-size: 16vw;
    white-space: nowrap;
    color: white;
    opacity: 0.4;
`;

const OverlayDiv = styled.div`
    position: absolute;
`;

const Text = styled.h2`
    position: relative;
    font-size: 22px;
    color: white;
    text-align: center;
    font-weight: 500;
    text-align: center;
    padding: 0 10vw;
    margin: 5px 0;

    ${devices.tablet`
        font-size: 28px;
    `};
`;

const MLHBanner = styled.a`
    display: block;
    position: absolute;
    left: 31px;
    top: 80px;
    z-index: 99;
`;

const MLHBannerImage = styled.img`
    width: 100%;
    max-width: 84px;
`;

class Landing extends React.Component {
    render() {
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
                    <LogoText>MHACKS 11</LogoText>
                    <OverlayDiv>
                        <Text>October 12th-14th</Text>
                        <Text>
                            University of Michigan - Intramural Sports Building
                        </Text>
                    </OverlayDiv>
                </Container>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Landing);
