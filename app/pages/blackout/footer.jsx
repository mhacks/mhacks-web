import React from 'react';
import styled from 'styled-components';

import { Container } from '../../components';
import { devices } from '../../styles';

const HeaderLogoImage = require('../../../static/icons/blackout-logo.png');
const InstagramImg = require('../../../static/icons/instagram.png');
const FacebookImg = require('../../../static/icons/facebook.png');
const TwitterImg = require('../../../static/icons/twitter.png');

/* Footer Style */
const Footer = styled.footer`
    position: relative;
    display: flex;
    padding: 1rem;
    alignContent: space-between;
    alignItems: center;
    flexWrap: wrap;
`;

const Text = styled.h2`
    fontSize: 16px;
    marginBottom: 0;
    textAlign: left;
    flex: 1;
    textAlign: center;
    minWidth: 100%;
    order: 1;

    ${devices.tablet`
        textAlign: left;
        minWidth: 0;
        order: 0;
    `}
`;

const HeaderLogo = styled.img`
    display: block;
    margin: auto;
    height: 90px;
`;

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

const Img100 = styled.img`
    height: 100%;
    margin: auto;
`;

const ImgButtonWrapper = styled.div`
    height: 30px;
    width: 30px;
    margin: 10px;
    textAlign: center;
    display: block;
`;

const ImgButton = props => (
    <ImgButtonWrapper>
        <a href={props.href}>
            <Img100 {...props} />
        </a>
    </ImgButtonWrapper>
);

class BlackoutFooter extends React.Component {
    render() {
        return (
            <Container>
                <Footer>
                    <Text>© MHacks 2017</Text>
                    <Flexer>
                        <HeaderLogo src={HeaderLogoImage} align="middle" />
                    </Flexer>
                    <Flexer right>
                        <ImgButton
                            src={FacebookImg}
                            alt="Facebook"
                            align="middle"
                            href="https://www.facebook.com/MHacksHackathon"
                        />
                        <ImgButton
                            src={InstagramImg}
                            alt="Instagram"
                            align="middle"
                            href="https://www.instagram.com/mhacks_"
                        />
                        <ImgButton
                            src={TwitterImg}
                            alt="Twitter"
                            align="middle"
                            href="https://twitter.com/mhacks"
                        />
                    </Flexer>
                </Footer>
            </Container>
        );
    }
}

export default BlackoutFooter;
