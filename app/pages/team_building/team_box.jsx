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
    textAlign: center;
    margin: 20px;
    maxWidth: 30%;
    minWidth: 250px;
    overflow: hidden;
`;

const Row = styled.div`
    display: flex;
    justifyContent: space-evenly;
`;

const FlexBox = styled.div`
    display: flex;
    flexDirection: column;
`;

const ButtonWrapper = styled.div`margin: 20px;`;

const PictureWrapper = styled.div`float: left;`;

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
        const team = this.props.team;
        const userEmail = this.props.userState.data.user.email;

        const memberEmails = team.members.map(member => member.email);
        const position = memberEmails.indexOf(userEmail);

        var display, clickFunction;

        if (position === -1) {
            display = 'Join Team';
            clickFunction = this.joinTeam;
        } else if (position === 0) {
            display = 'Delete Team';
            clickFunction = this.deleteTeam;
        } else {
            display = 'Leave Team';
            clickFunction = this.leaveTeam;
        }

        return (
            <Box>
                <Header>{team.name}</Header>
                <Description>{team.description}</Description>

                {team.members.map(function(member, i) {
                    return (
                        <Row key={i}>
                            <PictureWrapper>
                                <ProfilePicture avatars={[]} />
                            </PictureWrapper>
                            <FlexBox>
                                <p>{member.full_name}</p>
                                <p>{member.email}</p>
                            </FlexBox>
                        </Row>
                    );
                })}
                <ButtonWrapper>
                    <RoundedButton
                        type="submit"
                        color={props => props.theme.highlight}
                        onClick={clickFunction}
                    >
                        {display}
                    </RoundedButton>
                </ButtonWrapper>
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
