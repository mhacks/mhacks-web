import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { routes } from '../constants';
import { Container } from '../components';

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
    justifyContent: space-between;
    height: 90%;
`;

const Logo = styled.img`
    height: 70px;
    display: block;
`;

const NavContainer = styled.div`
    display: flex;
    alignItems: center;
    justifyContent: flex-end;
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

    &:hover {
        backgroundColor: ${props => props.primaryColor};
        color: white;
    }

    &:first-child {
        margin: 0;
    }
`;

class Header extends React.Component {
    render() {
        const { isLoggedIn, isApplied } = this.props.userState.data;

        return (
            <Wrapper>
                <Container>
                    <FlexWrapper>
                        <NavLink to={routes.HOME}><Logo src={HeaderLogoImage} /></NavLink>
                        <NavContainer>
                            {isApplied ?
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
