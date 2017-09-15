import React from 'react';
import { TeamsThunks } from '../../actions';
import styled from 'styled-components';
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
    margin: 20px;
    width: 250px;
    textAlign: center;
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
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        var teamId = this.props.team.id;
        this.props.dispatch(TeamsThunks.joinTeam(teamId));
    }

    render() {
        var team = this.props.team;
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

                <form onSubmit={this.onSubmit}>
                    <RoundedButton
                        type="submit"
                        color={props => props.theme.highlight}
                    >
                        Join Team
                    </RoundedButton>
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
