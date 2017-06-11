import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { routes } from '../../constants';
import { devices } from '../../styles';

import { NavLink } from 'react-router-dom';
import { SectionHeader, SectionBody } from './section_components.jsx';

const StyledNavLink = styled(NavLink)`
    fontSize: 20px;
    padding: 5px 35px;
    margin: 0px 15px;
    border: 2px solid ${props => props.primaryColor};
    color: ${props => props.primaryColor};
    borderRadius: 5px;
    textDecoration: none;
    transition: all 0.3s;

    &:hover {
        backgroundColor: ${props => props.primaryColor};
        color: white;
    }

    &:last-child {
        margin: 0;
    }
`;

const StyledNavLinkWrapper = styled.div`
    textAlign: center;

    ${devices.tablet`
        textAlign: left;
    `}
`;

class Apply extends React.Component {
    render() {
        return (
            <div>
                <SectionHeader>Apply</SectionHeader>
                <SectionBody>Apply to MHacks Nano! We will just ask you a couple quick questions. Nothing long or difficult :)</SectionBody>
                <StyledNavLinkWrapper>
                    {this.props.userState.data.isLoggedIn ?
                        <StyledNavLink
                            to={routes.APPLY}
                            primaryColor={this.props.theme.primary}
                        >
                        Apply
                        </StyledNavLink> :
                        <StyledNavLink
                            to={routes.LOGIN}
                            primaryColor={this.props.theme.primary}
                        >
                        Log In
                        </StyledNavLink>
                    }

                </StyledNavLinkWrapper>
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

export default connect(mapStateToProps)(Apply);
