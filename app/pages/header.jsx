import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import { routes } from '../constants';
import { devices } from '../styles';
import theme from '../styles/theme.js';
import { getUserMetadata } from '../util/user.js';

const HeaderLogoImage = require('../../static/icons/x-logo.png');
const Favicon = require('../../static/icons/x-logo.png');

/* Header Section */
const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-top: 15px
    padding-bottom: 15px
    z-index: 100;

    display: flex;
    height: 80px;
    align-items: center;
    justify-content: flex-start;
    background: ${theme.primary};
`;

const FlexWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90%;
    width: calc(100% - 72px);
    margin: 0 auto;

    ${devices.tablet`
        justify-content: space-between;
    `};
`;

const Logo = styled.img`
    height: 50px;
    display: block;

    ${devices.small`
        height: 50px;
    `};
`;

const NavContainer = styled.div`
    display: none;
    align-items: center;
    justify-content: flex-end;
    ${devices.tablet`
        ${props => (props.disableCompact ? 'display: flex' : '')};
    `};
`;

const HeaderNavLink = styled(NavLink)`
    margin: auto;
    margin-left: 0;
`;

const StyledNavLink = styled(NavLink)`
    font-size: 16px;
    padding: 2px 20px;
    margin: 10px 0 10px 15px;
    border: 2px solid ${props => props.color};
    color: ${props => props.color};
    background-color: ${theme.primary};
    border-radius: 25px;
    text-decoration: none;
    transition: all 0.3s;
    text-transform: uppercase;

    &:hover {
        background-color: ${props => props.color};
        color: white;
    }

    &:first-child {
        margin: 0;
        margin-left: 15px;
    }
`;

const StyledALink = styled.a`
    font-size: 16px;
    padding: 2px 20px;
    margin: 10px 0 10px 15px;
    border: 2px solid ${props => props.color};
    color: ${props => props.color};
    background-color: ${theme.primary};
    border-radius: 25px;
    text-decoration: none;
    transition: all 0.3s;
    text-transform: uppercase;

    &:hover {
        background-color: ${props => props.color};
        color: white;
    }

    &:first-child {
        margin: 0;
        margin-left: 15px;
    }
`;

const Burger = styled.div`
    .bm-burger-button {
        position: fixed;
        width: 36px;
        height: 30px;
        right: 36px;
        top: 25px;
    }

    .bm-burger-bars {
        background: ${props => props.primaryColor};
        height: 15% !important;
        border-radius: 10px;
    }

    .bm-cross-button {
        height: 24px;
        width: 24px;
    }

    .bm-cross {
        background: ${props => props.primaryColor};
    }

    .bm-menu {
        background-color: ${theme.primary};
        padding: 2.5em 1.5em 0;
        font-size: 1.15em;
    }

    .bm-morph-shape {
        fill: #373a47;
    }

    .bm-item-list {
        color: white;
        padding: 0.8em;
    }

    .bm-overlay {
        background: rgba(0, 0, 0, 0.3);
        top: 0;
        left: 0;
    }

    .bm-menu-wrap {
        top: 0;
    }

    ${devices.tablet`
        ${props => (props.disableCompact ? 'display: none' : '')};
    `};
`;

class HeaderLinks extends React.Component {
    render() {
        const {
            color,
            userMetadata,
            isCompact,
            configurationData
        } = this.props;
        const {
            isLoggedIn,
            isAccepted,
            isConfirmed,
            isAdmin,
            isSponsor,
            isReader,
            isEmailVerified
        } = userMetadata;
        const {
            is_live_page_enabled,
            is_team_building_enabled
        } = configurationData;

        // Either render a Menu component for mobile, or NavContainer for desktop as
        // the parent component for the navigation links.
        const WrappingComponent = isCompact ? Menu : NavContainer;
        return (
            <WrappingComponent
                right
                disableCompact={!userMetadata.isLoggedIn}
                isOpen={false}
            >
                {isLoggedIn && isAdmin ? (
                    <StyledALink href={routes.ADMIN} color={color}>
                        Admin
                    </StyledALink>
                ) : null}
                {isLoggedIn && (isSponsor || isAdmin) ? (
                    <StyledALink href={routes.SPONSOR_READER} color={color}>
                        Sponsor
                    </StyledALink>
                ) : null}
                {isLoggedIn && (isReader || isAdmin) ? (
                    <StyledALink href={routes.HACKER_READER} color={color}>
                        Reader
                    </StyledALink>
                ) : null}
                {!isLoggedIn || !isEmailVerified ? null : (
                    <StyledNavLink to={routes.APPLY} color={color}>
                        Hacker App
                    </StyledNavLink>
                )}
                {isLoggedIn ? (
                    <StyledNavLink to={routes.MENTOR_APPLICATION} color={color}>
                        Mentor App
                    </StyledNavLink>
                ) : null}
                {isLoggedIn ? (
                    <StyledNavLink
                        to={routes.SPEAKER_APPLICATION}
                        color={color}
                    >
                        Speaker App
                    </StyledNavLink>
                ) : null}
                {isLoggedIn ? (
                    <StyledNavLink to={routes.PROFILE} color={color}>
                        Edit Profile
                    </StyledNavLink>
                ) : null}
                {isLoggedIn ? (
                    <StyledNavLink to={routes.DASHBOARD} color={color}>
                        Dashboard
                    </StyledNavLink>
                ) : null}
                {isLoggedIn && is_live_page_enabled ? (
                    <StyledNavLink to={routes.LIVE} color={color}>
                        Live
                    </StyledNavLink>
                ) : null}
                {isLoggedIn &&
                isAccepted &&
                isConfirmed &&
                is_team_building_enabled ? (
                    <StyledNavLink to={routes.TEAM_BUILDING} color={color}>
                        Blueprinting
                    </StyledNavLink>
                ) : null}
                {isLoggedIn ? (
                    <StyledNavLink to={routes.LOGOUT} color={color}>
                        Log Out
                    </StyledNavLink>
                ) : (
                    <StyledNavLink to={routes.LOGIN} color={color}>
                        Log In
                    </StyledNavLink>
                )}
            </WrappingComponent>
        );
    }
}

class Header extends React.Component {
    render() {
        const userData = this.props.userState.data;
        const userMetadata = getUserMetadata(userData);
        const configurationData = this.props.configurationState.data;

        return (
            <div>
                {window.location.pathname == routes.SUBSCRIBE ? null : (
                    <div>
                        <Helmet>
                            <title>MHacks X</title>

                            <link
                                rel="icon"
                                type="image/x-icon"
                                href={Favicon}
                            />
                        </Helmet>
                        <Wrapper>
                            <FlexWrapper>
                                <HeaderNavLink to={routes.HOME}>
                                    <Logo src={HeaderLogoImage} />
                                </HeaderNavLink>
                                <HeaderLinks
                                    userMetadata={userMetadata}
                                    configurationData={configurationData}
                                    color={this.props.theme.highlight}
                                    isCompact={false}
                                />
                                <Burger
                                    primaryColor={this.props.theme.highlight}
                                    disableCompact={!userMetadata.isLoggedIn}
                                >
                                    <HeaderLinks
                                        userMetadata={userMetadata}
                                        configurationData={configurationData}
                                        color={this.props.theme.highlight}
                                        isCompact={true}
                                    />
                                </Burger>
                            </FlexWrapper>
                        </Wrapper>
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        configurationState: state.configurationState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Header);
