import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { routes } from '../../constants';
import { Container } from '../../components';
import { NavLink } from 'react-router-dom';
import { SectionHeader } from './section_components.jsx';
import theme from '../../styles/theme';

const Wrapper = styled.div`
    background: ${props => props.color};
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
`;

const Holder = styled.div`
    background: white;
    padding: 10px 0;
    margin: 0px 10%;
`;

const StyledNavLink = styled(NavLink)`
    font-size: 16px;
    padding: 10px 60px;
    border: 2px solid ${props => props.color};
    color: ${props => props.color};
    background-color: ${theme.color};
    border-radius: 25px;
    text-decoration: none;
    transition: all 0.3s;
    text-transform: uppercase;

    &:hover {
        background-color: ${props => props.color};
        color: white;
    }
`;

const StyledNavLinkWrapper = styled.div`
    text-align: center;
    padding-top: 20px;
`;

const Dashed = styled.div`
    position: relative;
    top: 40px;
    height: 60px;
    left: 50%
    border-left: 1px solid ${theme.highlightSecondary};
`;

class Apply extends React.Component {
    render() {
        const is_application_open = this.props.configurationState.data
            .is_application_open;

        return (
            <Wrapper>
                <Container>
                    <Holder>
                        <SectionHeader>
                            {is_application_open
                                ? 'Applications are open now!'
                                : 'Applications are now closed.'}
                        </SectionHeader>
                        <StyledNavLinkWrapper>
                            {this.props.userState.data.isLoggedIn ? (
                                <StyledNavLink
                                    to={
                                        is_application_open
                                            ? routes.APPLY
                                            : routes.DASHBOARD
                                    }
                                    color={this.props.theme.primary}
                                >
                                    {is_application_open
                                        ? 'Apply'
                                        : 'Dashboard'}
                                </StyledNavLink>
                            ) : (
                                <StyledNavLink
                                    to={routes.LOGIN}
                                    color={this.props.theme.primary}
                                >
                                    Login
                                </StyledNavLink>
                            )}
                        </StyledNavLinkWrapper>
                        <Dashed />
                    </Holder>
                </Container>
            </Wrapper>
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

export default connect(mapStateToProps)(Apply);
