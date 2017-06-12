import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { routes } from '../constants';
import { Container } from '../components';
import { devices } from '../styles';

const HeaderLogoImage = require('../../static/icons/nano-logo.png');

/* Header Section */
const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    paddingTop: 30px
    paddingBottom: 10px

    display: flex;
    height: 90px;
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
    height: 70px;
    display: block;
`;

const HeaderNavLink = styled(NavLink)`
    margin: auto;
    ${devices.small`
        marginLeft: 0;
    `}
`;

const NavContainer = styled.div`
    display: flex;
    alignItems: center;
    justifyContent: flex-end;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    marginRight: 0;
`;

const StyledNavLink = styled(NavLink)`
    fontSize: 18px;
    padding: 5px 25px;
    marginLeft: 15px;
    border: 2px solid ${props => props.primaryColor};
    color: ${props => props.primaryColor};
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
    }

`;

class Header extends React.Component {
    render() {
        const { isLoggedIn, isApplied, isEmailVerified } = this.props.userState.data;

        return (
            <Wrapper>
                <Container>
                    <FlexWrapper>
                        <HeaderNavLink to={routes.HOME}><Logo src={HeaderLogoImage} /></HeaderNavLink>
                        <NavContainer>
                            {!isLoggedIn || !isEmailVerified || isApplied ?
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
                    </FlexWrapper>
                </Container>
            </Wrapper>
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
