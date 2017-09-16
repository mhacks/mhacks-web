import React from 'react';
import { TeamsThunks } from '../../actions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RoundedButton } from '../../components';
import { ProfilePicture } from '../../components';

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
    padding: 10px;
    margin: 20px;
    width: 300px;
    textAlign: center;
`;

const Row = styled.div`
    display: flex;
    margin: 10px;
    justifyContent: space-evenly;
`;

const ProfileContainer = styled.div``;

class TeamBox extends React.Component {
    constructor(props) {
        super(props);

        this.joinTeam = this.joinTeam.bind(this);
        this.leaveTeam = this.leaveTeam.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
    }

    joinTeam(e) {
        e.preventDefault();

        var teamId = this.props.team.id;
        this.props.dispatch(TeamsThunks.joinTeam(teamId));
    }

    leaveTeam(e) {
        e.preventDefault();

        var teamId = this.props.team.id;
        this.props.dispatch(TeamsThunks.leaveTeam(teamId));
    }

    deleteTeam(e) {
        e.preventDefault();

        var teamId = this.props.team.id;
        this.props.dispatch(TeamsThunks.deleteTeam(teamId));
    }

    render() {
        var team = this.props.team;
        var teamName = team.name;
        var description = team.description;
        var members = team.members;

        const user = this.props.userState.data.user;

        return (
            <Box>
                <Header>{teamName}</Header>
                <Description>{description}</Description>

                {members.map(function(member, i) {
                    return (
                        <Row key={i}>
                            <ProfileContainer>
                                <ProfilePicture avatars={user.avatars} />
                            </ProfileContainer>
                            <p>{member.full_name}</p>
                            <p>{member.email}</p>
                        </Row>
                    );
                })}
                <RoundedButton
                    type="submit"
                    color={props => props.theme.highlight}
                    onClick={this.joinTeam}
                >
                    Join Team
                </RoundedButton>
                <RoundedButton
                    type="submit"
                    color={props => props.theme.highlight}
                    onClick={this.leaveTeam}
                >
                    Leave Team
                </RoundedButton>
                <RoundedButton
                    type="submit"
                    color={props => props.theme.highlight}
                    onClick={this.deleteTeam}
                >
                    Delete Team
                </RoundedButton>
            </Box>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(TeamBox);
