import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { routes } from '../../constants';
import { devices } from '../../styles';
import { Container } from '../../components';
import { NavLink } from 'react-router-dom';
import { SectionHeader, SectionBody } from './section_components.jsx';

const Wrapper = styled.div`
    background: ${props => props.theme.gradientOverlay}, ${props =>
    props.theme.primary}
    padding: 80px 0;
`;

const StyledNavLink = styled(NavLink)`
    display: inline-block;
    font-size: 20px;
    padding: 5px 35px;
    margin: 0px 15px;
    border: 2px solid ${props => props.primaryColor};
    color: ${props => props.primaryColor};
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.3s;

    &:hover {
        background-color: ${props => props.primaryColor};
        color: white;
    }

    &:last-child {
        margin: 0;
    }
`;

const StyledNavLinkWrapper = styled.div`
    text-align: center;

    ${devices.tablet`
        text-align: left;
    `};
`;

class Apply extends React.Component {
    render() {
        return (
            <Wrapper>
                <Container>
                    <SectionHeader>Apply</SectionHeader>
                    <SectionBody>
                        Apply to MHacks Nano! We will just ask you a couple
                        quick questions. Nothing long or difficult :)
                    </SectionBody>
                    <StyledNavLinkWrapper>
                        {this.props.userState.data.isLoggedIn ? (
                            <StyledNavLink
                                to={routes.APPLY}
                                primaryColor="white"
                            >
                                Apply
                            </StyledNavLink>
                        ) : (
                            <StyledNavLink
                                to={routes.LOGIN}
                                primaryColor={this.props.theme.highlight}
                            >
                                Log In
                            </StyledNavLink>
                        )}
                    </StyledNavLinkWrapper>
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

export default connect(mapStateToProps)(Apply);
