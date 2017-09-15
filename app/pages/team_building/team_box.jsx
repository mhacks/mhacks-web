import React from 'react';
import { TeamsThunks } from '../../actions';
import styled from 'styled-components';
import { routes } from '../../constants';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { RoundedButton } from '../../components';

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

const ButtonGroup = styled.div`
    display: flex;
    flexDirection: row;
    justifyContent: space-between;
`;

class TeamBox extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        var teamId = '59bac3f28f7a6f002b4f0a86';
        this.props.dispatch(TeamsThunks.joinTeam(teamId));
    }

    render() {
        var teamName = 'Team Name';
        var description =
            'Test description goes here lorem ipsum can have a pipsum';

        return (
            <Box>
                <Header>{teamName}</Header>
                <Description>{description}</Description>
                <Row>
                    <UserBox />
                    <p>Member 1</p>
                </Row>
                <Row>
                    <UserBox />
                    <p>Member 2</p>
                </Row>
                <Row>
                    <UserBox />
                    <p>Member 3</p>
                </Row>
                <Row>
                    <UserBox />
                    <p>Member 4</p>
                </Row>
                <Row>
                    <UserBox />
                    <p>Member 5</p>
                </Row>
                <StyledNavLink to={routes.CONFIRM}>Join Team</StyledNavLink>

                <form onSubmit={this.onSubmit}>
                    <ButtonGroup>
                        <RoundedButton
                            type="submit"
                            color={props => props.theme.highlight}
                        >
                            Save
                        </RoundedButton>
                    </ButtonGroup>
                </form>
            </Box>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(TeamBox);
