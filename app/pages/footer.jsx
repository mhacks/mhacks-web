import React from 'react';
import styled from 'styled-components';

import { Container } from '../components';
import { devices } from '../styles';
import { routes } from '../constants';

/* Footer Style */
const FooterWrapper = styled.div`
    background-color: ${props => props.theme.secondary};
`;

const HomeFooter = styled.footer`
    position: relative;
    display: flex;
    padding: 1rem;
    align-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

const Text = styled.h2`
    color: white;
    font-size: 12px;
    margin-bottom: 0;
    text-align: left;
    flex: 1;
    text-align: center;
    min-width: 100%;
    order: 1;

    ${devices.tablet`
        text-align: left;
        text-indent: 50px;
        min-width: 0;
        order: 0;
    `};
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

const ImgButtonWrapper = styled.div`
    height: 30px;
    width: 30px;
    margin: 10px;
    text-align: center;
    display: block;
`;

const LegalLinks = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 100%;
    text-align: center;
    font-size: 12px;
    order: 2;
    margin-top: 10px;

    ${devices.tablet`
        text-align: right;
        min-width: 0;
        margin-top: 0;

        ${props => (props.right ? 'justify-content: flex-end;' : '')}
    `};
`;

const LegalLink = styled.a`
    color: ${props => props.theme.highlight};
    text-decoration: none;
`;

const I100 = styled.i`
    height: 100%;
    margin: auto;
`;

const FaButton = props => (
    <ImgButtonWrapper>
        <a href={props.href} style={{ color: 'white' }}>
            <I100 {...props} />
        </a>
    </ImgButtonWrapper>
);

class Footer extends React.Component {
    render() {
        return (
            <div>
                {window.location.pathname === routes.SUBSCRIBE ? null : (
                    <FooterWrapper id="asdfFooter">
                        <Container>
                            <HomeFooter>
                                <Text>© MHacks 2018</Text>
                                <Flexer>
                                    <FaButton
                                        className="fab fa-facebook-f fa-2x"
                                        alt="Medium"
                                        align="middle"
                                        href="https://www.facebook.com/MHacksHackathon"
                                    />
                                    <FaButton
                                        className="fab fa-instagram fa-2x"
                                        alt="Instagram"
                                        align="middle"
                                        href="https://www.instagram.com/mhacks_"
                                    />
                                    <FaButton
                                        className="fab fa-twitter fa-2x"
                                        alt="Twitter"
                                        align="middle"
                                        href="https://twitter.com/mhacks"
                                    />
                                    <FaButton
                                        className="fab fa-medium-m fa-2x"
                                        alt="Medium"
                                        align="middle"
                                        href="https://blog.mhacks.org"
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
