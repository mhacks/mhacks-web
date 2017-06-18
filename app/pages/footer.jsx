import React from 'react';
import styled from 'styled-components';

import { Container } from '../components';
import { devices } from '../styles';
import { routes } from '../constants';

const InstagramImg = require('../../static/icons/instagram.png');
const FacebookImg = require('../../static/icons/facebook.png');
const TwitterImg = require('../../static/icons/twitter.png');

/* Footer Style */
const FooterWrapper = styled.div`
    marginTop: 40px;
    ${devices.tablet`
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    `}
`;

const HomeFooter = styled.footer`
    position: relative;
    display: flex;
    padding: 1rem;
    alignContent: space-between;
    alignItems: center;
    flexWrap: wrap;
`;

const Text = styled.h2`
    color: gray;
    fontSize: 12px;
    marginBottom: 0;
    textAlign: left;
    flex: 1;
    textAlign: center;
    minWidth: 100%;
    order: 1;

    ${devices.tablet`
        textAlign: left;
        textIndent: 50px;
        minWidth: 0;
        order: 0;
    `}
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
    height: 20px;
    width: 20px;
    margin: 5px;
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

class Footer extends React.Component {
    render() {
        return (
            <div>
                { window.location.pathname == routes.SUBSCRIBE ?
                    null :
                    <Container>
                        <FooterWrapper>
                            <HomeFooter>
                                <Text>© MHacks 2017</Text>
                                <Flexer>
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
                                <Flexer/>
                            </HomeFooter>
                        </FooterWrapper>
                    </Container>
                }
            </div>
        );
    }
}

export default Footer;
