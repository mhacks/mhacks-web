import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { Container } from '../components';
import { devices } from '../styles';
import { routes } from '../constants';

import MHacksLogo from '../../static/m12/logo.svg';

/* Footer Style */
const FooterWrapper = styled.div`
    background-color: ${props => props.theme.primary};
`;

const HomeFooter = styled.footer`
    position: relative;
    display: flex;
    padding: 1rem;
    align-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

const Flexer = styled.div`
    flex: 1;
    order: 2;
    position: relative;
    display: flex;
    justify-content: center;
    min-width: 100%;

    ${devices.tablet`
        text-align: right;
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

const Dot = styled.div`
    height: 4px;
    width: 4px;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
    margin: 7px;
`;

const LegalLinks = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-width: 100%;
    text-align: center;
    font-size: 12px;
    order: 0;
    margin-top: 10px;
    color: white;

    ${devices.tablet`
        text-align: left;
        min-width: 0;
        margin-top: 0;

        ${props => (props.right ? 'justify-content: flex-end;' : '')}
    `};
`;

const LegalLink = styled.a`
    text-decoration: none;
    color: white;
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
                                <LegalLinks>
                                    <LegalLink>
                                        © MHacks{' '}
                                        {new Date(
                                            this.props.configurationState.data.start_date
                                        ).toLocaleString('default', {
                                            year: 'numeric',
                                            timeZone: 'America/Detroit'
                                        })}
                                    </LegalLink>
                                    <Dot />
                                    <LegalLink href="https://docs.google.com/document/d/1L9wC7lfXmOBCKdUQancuoYQf86KIQqUJ0is4dr8QqQM/pub">
                                        MHacks CoC
                                    </LegalLink>
                                    <Dot />
                                    <LegalLink href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">
                                        MLH CoC
                                    </LegalLink>
                                </LegalLinks>
                                <ImgButtonWrapper
                                    style={{
                                        order: 1,
                                        flex: 1,
                                        position: 'relative',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <img src={MHacksLogo} height={30} />
                                </ImgButtonWrapper>
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
                            </HomeFooter>
                        </Container>
                    </FooterWrapper>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data,
        configurationState: state.configurationState
    };
}

export default connect(mapStateToProps)(Footer);
