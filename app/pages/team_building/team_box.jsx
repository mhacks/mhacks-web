import React from 'react';
import styled from 'styled-components';
import { routes } from '../../constants';
import { NavLink } from 'react-router-dom';

const Header = styled.h2`
    fontSize: 20px;
    color: ${props => props.theme.primary};
    fontWeight: thin;
`;

const Description = styled.h2`
    fontSize: 15px;
    color: ${props => props.theme.highlightSecondary};
`;

const Box = styled.div`
    borderRadius: 25px;
    border: 2px solid ${props => props.theme.secondary};
    padding: 20px;
    margin: 20px;
    width: 250px;
    textAlign: center;
`;

const StyledNavLink = styled(NavLink)`
    fontSize: 16px;
    padding: 2px 20px;
    border: 2px solid ${props => props.theme.highlight};
    color: ${props => props.theme.highlight};
    borderRadius: 25px;
    textDecoration: none;
    transition: all 0.3s;
    text-transform: uppercase;
    &:hover {
        backgroundColor: ${props => props.theme.highlight};
        color: white;
    }
`;

const UserBox = styled.div`
    borderRadius: 25px;
    border: 2px solid ${props => props.theme.secondary};
    padding: 20px;
    width: 20px;
    textAlign: center;
`;

const Row = styled.div`
    display: flex;
    margin: 10px;
    justifyContent: space-evenly;
`;

class TeamBox extends React.Component {
    render() {
        var team = this.props.team
        var teamName = team.name;
        var description = team.description;
        var members = team.members;

        return (
            <Box>
                <Header>{teamName}</Header>
                <Description>{description}</Description>

                {members.map(function(member, i) {
                    return (
                        <Row key={i}>
                            <UserBox />
                            <p>{member.full_name}</p>
                        </Row>
                    );
                })}
                <StyledNavLink to={routes.CONFIRM}>Join Team</StyledNavLink>
            </Box>
        );
    }
}

export default TeamBox;
