import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { slide as Menu } from 'react-burger-menu'
import { routes } from '../constants';
import { Container } from '../components';
import { devices } from '../styles';

const HeaderLogoImage = require('../../static/icons/nano-logo.png');
const Favicon = require('../../static/nano/favicon.png');

/* Header Section */
const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    paddingTop: 30px
    paddingBottom: 30px
    zIndex: 100;

    display: flex;
    height: 90;
    alignItems: center;
    justifyContent: flex-start;
    background: white;
`;

const FlexWrapper = styled.div`
    display: flex;
    alignItems: center;
    justifyContent: center;
    height: 90%;

    ${devices.tablet`
        justifyContent: space-between;
    `}
`;

const Logo = styled.img`
    height: 50px;
    display: block;

    ${devices.small`
        height: 70px;
    `}
`;

const NavContainer = styled.div`
    display: none;
    alignItems: center;
    justifyContent: flex-end;
    ${devices.tablet`
        display: flex;
    `}
`;

const HeaderNavLink = styled(NavLink)`
    margin: auto;
    marginLeft: 0;
`;

const StyledNavLink = styled(NavLink)`
    fontSize: 18px;
    padding: 5px 25px;
    marginLeft: 15px;
    border: 2px solid ${props => props.primaryColor};
    color: ${props => props.primaryColor};
    backgroundColor: white;
    borderRadius: 5px;
    textDecoration: none;
    transition: all 0.3s;
    marginTop: 10px;

    &:hover {
        backgroundColor: ${props => props.primaryColor};
        color: white;
    }

    &:first-child {
        margin: 0;
        marginTop: 10px;
        marginLeft: 15px;
    }
`;

const Burger = styled.div`
    .bm-burger-button {
      position: fixed;
      width: 36px;
      height: 30px;
      right: 36px;
      top: 40px;
    }

    .bm-burger-bars {
      background: ${props => props.primaryColor};
    }

    .bm-cross-button {
      height: 24px;
      width: 24px;
    }

    .bm-cross {
      background: ${props => props.primaryColor};
    }

    .bm-menu {
      background: white;
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
    }

    .bm-menu-wrap {
        top: 0;
    }

    ${devices.small`
        .bm-burger-button {
            top: 50px;
        }
    `}

    ${devices.tablet`
        display: none;
    `}
`;

class Header extends React.Component {
    render() {
        const { isLoggedIn, isApplicationSubmitted, isEmailVerified } = this.props.userState.data;

        return (
            <div>
                { window.location.pathname == routes.SUBSCRIBE ?
                    null :
                    <div>
                        <Helmet>
                            <title>MHacks Nano</title>

                            <link rel="icon" type="image/x-icon" href={Favicon} />
                        </Helmet>
                        <Wrapper>
                            <Container>
                                <FlexWrapper>
                                    <HeaderNavLink to={routes.HOME}><Logo src={HeaderLogoImage} /></HeaderNavLink>
                                    <NavContainer>
                                        {!isLoggedIn || !isEmailVerified || isApplicationSubmitted ?
                                            null :
                                            <StyledNavLink
                                                to={routes.APPLY}
                                                primaryColor={this.props.theme.primary}
                                            >
                                            Apply
                                            </StyledNavLink>
                                        }
                                        {isLoggedIn ?
                                            <StyledNavLink
                                                to={routes.PROFILE}
                                                primaryColor={this.props.theme.primary}
                                            >
                                            Profile
                                            </StyledNavLink> :
                                            null
                                        }
                                        {isLoggedIn ?
                                            <StyledNavLink
                                                to={routes.LOGOUT}
                                                primaryColor={this.props.theme.primary}
                                            >
                                            Log Out
                                            </StyledNavLink> :
                                            <StyledNavLink
                                                to={routes.LOGIN}
                                                primaryColor={this.props.theme.primary}
                                            >
                                            Log In
                                            </StyledNavLink>
                                        }
                                    </NavContainer>
                                    <Burger
                                        primaryColor={this.props.theme.primary}
                                    >
                                        <Menu right>
                                            {!isLoggedIn || !isEmailVerified || isApplicationSubmitted ?
                                                null :
                                                <StyledNavLink
                                                    to={routes.APPLY}
                                                    primaryColor={this.props.theme.primary}
                                                >
                                                Apply
                                                </StyledNavLink>
                                            }
                                            {isLoggedIn ?
                                                <StyledNavLink
                                                    to={routes.PROFILE}
                                                    primaryColor={this.props.theme.primary}
                                                >
                                                Profile
                                                </StyledNavLink> :
                                                null
                                            }
                                            {isLoggedIn ?
                                                <StyledNavLink
                                                    to={routes.LOGOUT}
                                                    primaryColor={this.props.theme.primary}
                                                >
                                                Log Out
                                                </StyledNavLink> :
                                                <StyledNavLink
                                                    to={routes.LOGIN}
                                                    primaryColor={this.props.theme.primary}
                                                >
                                                Log In
                                                </StyledNavLink>
                                            }
                                        </Menu>
                                    </Burger>
                                </FlexWrapper>
                            </Container>
                        </Wrapper>
                    </div>
                }
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Header);
