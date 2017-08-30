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
    backgroundColor: ${props => props.theme.secondary};
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
    color: white;
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
    `};
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
    `};
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

const LegalLinks = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flexDirection: column;
    justifyContent: center;
    minWidth: 100%;
    textAlign: center;
    fontSize: 12px;
    order: 2;
    marginTop: 10px;

    ${devices.tablet`
        textAlign: right;
        minWidth: 0;
        marginTop: 0;

        ${props => (props.right ? 'justifyContent: flex-end;' : '')}
    `};
`;

const LegalLink = styled.a`
    color: ${props => props.theme.highlight};
    textDecoration: none;
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
                {window.location.pathname == routes.SUBSCRIBE ? null : (
                    <FooterWrapper id="asdfFooter">
                        <Container>
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
                                <LegalLinks>
                                    <LegalLink href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                        MHacks CoC
                                    </LegalLink>
                                    <LegalLink href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">
                                        MLH CoC
                                    </LegalLink>
                                </LegalLinks>
                            </HomeFooter>
                        </Container>
                    </FooterWrapper>
                )}
            </div>
        );
    }
}

export default Footer;
