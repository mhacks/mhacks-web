import React from 'react';
import { TeamsThunks } from '../../actions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RoundedButton } from '../../components';
import { ProfilePicture } from '../../components';
import { devices } from '../../styles';

const Seperator = styled.div`
    background: ${props => props.theme.primary};
    width: 80%;
    height: 2px;
    margin: 15px auto;
`;

const Header = styled.h2`
    fontSize: 20px;
    color: ${props => props.theme.primary};
    fontWeight: bold;
`;

const Description = styled.p`
    fontSize: 15px;
    color: ${props => props.theme.primary};
    margin: 20px;
`;

const Box = styled.div`
    borderRadius: 25px;
    border: 3px solid ${props => props.theme.primary};
    textAlign: center;
    margin: 20px;
    minWidth: 250px;
    overflow: hidden;

    ${devices.tablet`
        maxWidth: 45%;
    `} ${devices.giant`
        maxWidth: 30%;
    `};
`;

const Row = styled.div`
    display: flex;
    margin: 20px;
`;

const FlexBox = styled.div`
    display: flex;
    flexDirection: column;
    textAlign: left;
    marginLeft: 20px;
`;

const EmailLabel = styled.p`wordBreak: break-all;`;

const ButtonWrapper = styled.div`margin: 20px;`;

const PictureWrapper = styled.div``;

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
        this.props.onTeamJoined();
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
        const userInTeam = this.props.userInTeam || false;

        const memberEmails = team.members.map(member => member.email);
        const position = memberEmails.indexOf(userEmail);

        var display, clickFunction;

        if (position === -1 && userInTeam) {
            display = 'Already in a Team';
            clickFunction = () => null;
        } else if (position === -1 && !userInTeam) {
            display = 'Join Team';
            clickFunction = this.joinTeam;
        } else if (memberEmails.length === 1 && position === 0) {
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
                        <div key={i}>
                            <Seperator />
                            <Row>
                                <PictureWrapper>
                                    <ProfilePicture avatars={[]} />
                                </PictureWrapper>
                                <FlexBox>
                                    <p>{member.full_name}</p>
                                    <EmailLabel>{member.email}</EmailLabel>
                                </FlexBox>
                            </Row>
                        </div>
                    );
                })}
                <ButtonWrapper>
                    <RoundedButton
                        type="submit"
                        color={props => props.theme.primary}
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
