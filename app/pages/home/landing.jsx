import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
const Logo = require('../../../static/icons/x-logo-title.png');
import { devices } from '../../styles';

const Wrapper = styled.div`
    background: ${props => props.theme.secondary};
    padding: 0;
    height: calc(100vh - 80px);
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

    ${devices.tablet`
        width: calc(100% - 100px);
    `} ${devices.desktop`
        width: calc(100% - 140px);
    `} ${devices.giant`
        width: calc(100% - 160px);
    `};
`;

const LogoImage = styled.img`
    height: auto;
    width: auto;
    max-height: 50%;
    max-width: 90%;

    margin-bottom: 20px;
    z-index: 99;
`;

const Text = styled.h2`
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
    width: 60px;
    position: absolute;
    left: 31px;
    top: 80px;
    z-index: 99;
`;

const MLHBannerImage = styled.img`
    width: 100%;
`;

class Landing extends React.Component {
    render() {
        return (
            <Wrapper>
                <MLHBanner
                    href="https://mlh.io/seasons/na-2018/events?utm_source=na-2018&utm_medium=TrustBadge&utm_campaign=na-2018&utm_content=gray"
                    target="_blank"
                >
                    <MLHBannerImage
                        src="https://s3.amazonaws.com/logged-assets/trust-badge/2018/gray.svg"
                        alt="Major League Hacking 2017 Hackathon Season"
                    />
                </MLHBanner>
                <Container>
                    <LogoImage src={Logo} />
                    <Text>September 22nd - 24th, 2017</Text>
                    <Text>University of Michigan North Campus</Text>
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
