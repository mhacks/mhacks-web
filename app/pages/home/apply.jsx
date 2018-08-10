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
`;

const StyledNavLink = styled(NavLink)`
    font-size: 16px;
    padding: 2px 20px;
    margin: 10px 0 10px 15px;
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

    &:first-child {
        margin: 0;
        margin-left: 15px;
    }
`;

const StyledNavLinkWrapper = styled.div`
    text-align: center;
`;

const Dashed = styled.div`
    position: relative;
    top: 40px;
    height: 40px;
    left: 50%;
    border-left: 2px solid #444;
`;

class Apply extends React.Component {
    render() {
        return (
            <Wrapper color={this.props.theme.primary}>
                <Container>
                    <Holder>
                        <SectionHeader>
                            Applications are open now!
                        </SectionHeader>
                        <StyledNavLinkWrapper>
                            {this.props.userState.data.isLoggedIn ? (
                                <StyledNavLink to={routes.APPLY} color="white">
                                    Apply
                                </StyledNavLink>
                            ) : (
                                <StyledNavLink
                                    to={routes.LOGIN}
                                    color={this.props.theme.highlight}
                                >
                                    Log In
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
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(Apply);
