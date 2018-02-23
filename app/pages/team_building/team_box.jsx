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
    font-size: 20px;
    color: ${props => props.theme.primary};
    font-weight: bold;
`;

const Description = styled.p`
    font-size: 15px;
    color: ${props => props.theme.primary};
    margin: 20px;
`;

const BoxWrapper = styled.div`
    border-radius: 25px;
    border: 3px solid ${props => props.theme.primary};
    text-align: center;
    margin: 20px;
    min-width: 250px;
    overflow: hidden;
    max-width: 80%;

    ${devices.tablet`
        max-width: 40%;
    `} ${devices.giant`
        max-width: 30%;
    `};
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    margin: 20px;
`;

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 20px;
`;

const EmailLink = styled.a`
    word-break: break-all;
`;

const ButtonWrapper = styled.div`
    margin: 20px;
`;

const StyledProfilePicture = styled(ProfilePicture)`
    max-width: 80px;
    min-width: 80px;
`;

const PictureWrapper = styled.div`
    width: 100px;
    height: 100px;
    overflow: hidden;
    border: 3px solid ${props => props.theme.primary};
`;

class TeamBox extends React.Component {
    constructor(props) {
        super(props);

        this.joinTeam = this.joinTeam.bind(this);
        this.leaveTeam = this.leaveTeam.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
        this.checkForFull = this.checkForFull.bind(this);
        this.checkGoodTeam = this.checkGoodTeam.bind(this);
    }

    joinTeam(e) {
        e.preventDefault();

        const user = this.props.userState.data.user;
        const data = {
            id: this.props.team.id,
            user: {
                full_name: user.full_name,
                email: user.email,
                avatars: user.avatars,
                experience: user.experience
            }
        };
        this.props.dispatch(TeamsThunks.joinTeam(data));
        this.props.onTeamJoined();
    }

    leaveTeam(e) {
        e.preventDefault();

        const user = this.props.userState.data.user;
        const data = { id: this.props.team.id, email: user.email };
        this.props.dispatch(TeamsThunks.leaveTeam(data));
    }

    deleteTeam(e) {
        e.preventDefault();

        var teamId = this.props.team.id;
        this.props.dispatch(TeamsThunks.deleteTeam(teamId));
    }

    checkForFull() {
        if (this.props.team.members.length === 4) {
            return true;
        } else {
            return false;
        }
    }

    checkGoodTeam(experiences) {
        var noviceCount = 0;
        var experiencedCount = 0;
        var veteranCount = 0;
        for (var i = 0; i < experiences.length; i++) {
            switch (experiences[i]) {
                case 'novice':
                    noviceCount++;
                    break;
                case 'experienced':
                    experiencedCount++;
                    break;
                case 'veteran':
                    veteranCount++;
                    break;
            }
        }
        if ((veteranCount > 0 || experiencedCount > 1) && noviceCount > 0) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const team = this.props.team;
        const userEmail = this.props.userState.data.user.email;
        const userInTeam = this.props.userInTeam || false;

        const memberEmails = team.members.map(member => member.email);
        const position = memberEmails.indexOf(userEmail);

        const experienceMap = {
            novice: 'Novice',
            experienced: 'Experienced',
            veteran: 'Veteran'
        };

        var display, clickFunction;

        if (position === -1 && userInTeam) {
            display = 'Already in a Team';
            clickFunction = () => null;
        } else if (position === -1 && !userInTeam) {
            if (team.members.length === 4) {
                var experiences = team.members.map(member => member.experience);
                experiences.push(this.props.userState.data.user.experience);
                if (this.checkGoodTeam(experiences)) {
                    display = 'Join For adopt-a-n00b';
                    clickFunction = this.joinTeam;
                } else {
                    display = 'Team Full';
                    clickFunction = () => null;
                }
            } else if (team.members.length === 5) {
                display = 'Team Full';
                clickFunction = () => null;
            } else {
                display = 'Join Team';
                clickFunction = this.joinTeam;
            }
        } else if (memberEmails.length === 1 && position === 0) {
            display = 'Delete Team';
            clickFunction = this.deleteTeam;
        } else {
            display = 'Leave Team';
            clickFunction = this.leaveTeam;
        }

        return (
            <BoxWrapper>
                <Header>{team.name}</Header>
                <Description>{team.description}</Description>

                {team.members.map(function(member, i) {
                    return (
                        <div key={i}>
                            <Seperator />
                            <Row>
                                <PictureWrapper>
                                    <StyledProfilePicture
                                        avatars={member.avatars}
                                    />
                                </PictureWrapper>
                                <FlexBox>
                                    <p>{member.full_name}</p>
                                    <EmailLink
                                        href={'mailto:'.concat(member.email)}
                                    >
                                        {member.email}
                                    </EmailLink>
                                    <p>{experienceMap[member.experience]}</p>
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
            </BoxWrapper>
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
