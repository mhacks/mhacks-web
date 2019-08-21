import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { routes } from '../../constants';
import { Container } from '../../components';
import { NavLink } from 'react-router-dom';
import { SectionHeader } from './section_components.jsx';
import theme from '../../styles/theme';
import { devices } from '../../styles';

const Wrapper = styled.div`
    background: ${props => props.color};
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Holder = styled.div`
    background: rgba(136, 136, 136, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 25px;
    padding: 10px 0;
    margin: 0px 20%;
`;

const StyledNavLink = styled(NavLink)`
    font-size: 16px;
    font-weight: 900;
    padding: 10px 10%;
    border: 4px solid ${props => props.color};
    color: ${props => props.color};
    background-color: ${theme.color};
    border-radius: 25px;
    text-decoration: none;
    transition: all 0.3s;
    text-transform: uppercase;

    &:hover {
        background-color: ${props => props.color};
        color: ${theme.primary};
    }
`;

const StyledNavLinkWrapper = styled.div`
    text-align: center;
    padding: 20px 0px 30px;
`;

const ApplyBoxText = styled(SectionHeader)`
    color: ${theme.highlight};
    padding: 0 10px;

    ${devices.tiny`
        font-size: 20px;
    `} ${devices.small`
        font-size: 24px;
    `};
`;

class Apply extends React.Component {
    render() {
        const is_application_open = this.props.configurationState.data
            .is_application_open;

        return (
            <Wrapper>
                <Container>
                    <Holder>
                        <ApplyBoxText>
                            {new Date(
                                this.props.configurationState.data.start_date
                            ).toLocaleString('default', {
                                month: 'long',
                                day: 'numeric'
                            })}
                            th–
                            {new Date(
                                this.props.configurationState.data.end_date
                            ).toLocaleString('default', { day: 'numeric' })}
                            th. U‑M Intramural Sports Building.
                        </ApplyBoxText>
                        <ApplyBoxText>
                            {is_application_open
                                ? 'Applications are now open!'
                                : 'Applications are now closed.'}
                        </ApplyBoxText>
                        <StyledNavLinkWrapper>
                            {this.props.userState.data.isLoggedIn ? (
                                <StyledNavLink
                                    to={
                                        is_application_open
                                            ? routes.APPLY
                                            : routes.DASHBOARD
                                    }
                                    color={this.props.theme.highlight}
                                >
                                    {is_application_open
                                        ? 'Apply'
                                        : 'Dashboard'}
                                </StyledNavLink>
                            ) : (
                                <StyledNavLink
                                    to={routes.LOGIN}
                                    color={this.props.theme.highlight}
                                >
                                    Login
                                </StyledNavLink>
                            )}
                        </StyledNavLinkWrapper>
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
