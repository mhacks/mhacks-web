import React from 'react';
import styled from 'styled-components';

import { Container } from '../../components';
import { devices } from '../../styles';

const HeaderLogoImage = require('../../../static/icons/blackout-logo.png');

/* Footer Style */
const Footer = styled.footer`
    position: relative;
    display: flex;
    padding: 1rem;
    align-content: space-between;
    align-ttems: center;
    flex-wrap: wrap;
`;

const Text = styled.h2`
    font-size: 16px;
    margin-bottom: 0;
    text-align: left;
    flex: 1;
    text-align: center;
    min-width: 100%;
    order: 1;
    ${devices.tablet`
        text-align: left;
        min-width: 0;
        order: 0;
    `};
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
    justify-content: center;
    min-width: 100%;
    ${devices.tablet`
        text-align: left;
        min-width: 0;
        ${props => (props.right ? 'justify-content: flex-end;' : '')}
    `};
`;

const I100 = styled.i`
    height: 100%;
    margin: auto;
`;

const ImgButtonWrapper = styled.div`
    height: 30px;
    width: 30px;
    margin: 10px;
    text-align: center;
    display: block;
`;

const FaButton = props => (
    <ImgButtonWrapper>
        <a href={props.href} style={{ color: 'inherit' }}>
            <I100 {...props} />
        </a>
    </ImgButtonWrapper>
);

class BlackoutFooter extends React.Component {
    render() {
        return (
            <Container>
                <Footer>
                    <Text>© MHacks 2018</Text>
                    <Flexer>
                        <HeaderLogo src={HeaderLogoImage} align="middle" />
                    </Flexer>
                    <Flexer right>
                        <FaButton
                            className="fab fa-facebook-f fa-3x"
                            alt="Medium"
                            align="middle"
                            href="https://www.facebook.com/MHacksHackathon"
                        />
                        <FaButton
                            className="fab fa-instagram fa-3x"
                            alt="Instagram"
                            align="middle"
                            href="https://www.instagram.com/mhacks_"
                        />
                        <FaButton
                            className="fab fa-twitter fa-3x"
                            alt="Twitter"
                            align="middle"
                            href="https://twitter.com/mhacks"
                        />
                        <FaButton
                            className="fab fa-medium-m fa-3x"
                            alt="Medium"
                            align="middle"
                            href="https://blog.mhacks.org"
                        />
                    </Flexer>
                </Footer>
            </Container>
        );
    }
}

export default BlackoutFooter;
