import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { PageContainer, MHForm, Alert } from '../../components';
import TeamBox from './team_box.jsx';
import { TeamsThunks } from '../../actions';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

const FlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`;

const BoxWrapper = styled.div`
    border-radius: 25px;
    border: 3px solid ${props => props.theme.primary};
    margin: 20px;
    padding: 20px;
    display: inline-block;
    width: 80%;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AlertContainer = styled.div`
    margin: 10px;
    min-width: 80%;
`;

const Description = styled.h3`
    color: ${props => props.theme.primary};
`;

const Bullet = styled.h4`
    color: ${props => props.theme.highlight};
`;

const PagePulled = styled(PageContainer)`
    min-height: calc(100vh - 146px);
`;

class TeamBuilding extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: OrderedSet(),
            descriptionLengthError: false,
            missingFieldsError: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onTeamJoined = this.onTeamJoined.bind(this);
        this.isUserInTeam = this.isUserInTeam.bind(this);
    }

    addNotification(message, key, action) {
        return this.setState({
            notifications: this.state.notifications.add({
                message,
                key,
                action: action || 'Dismiss',
                onClick: (notification, deactivate) => {
                    deactivate();
                    this.removeNotification(key);
                },
                dismissAfter: 5000
            })
        });
    }

    removeNotification(key) {
        this.setState({
            notifications: this.state.notifications.filter(n => n.key !== key)
        });
    }

    componentDidMount() {
        this.props.dispatch(TeamsThunks.loadTeamForm());
        this.props.dispatch(TeamsThunks.loadTeams());

        // refresh teams every 20 seconds
        this.poll = setInterval(() => {
            this.props.dispatch(TeamsThunks.loadTeams());
        }, 20 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.poll);
    }

    onSubmit(formData) {
        var errors = false;
        this.setState({
            descriptionLengthError: false,
            missingFieldsError: false
        });

        if (!formData.description || formData.description.length < 40) {
            errors = true;
            this.setState({
                descriptionLengthError: true
            });
        }

        if (!formData.description || !formData.name) {
            errors = true;
            this.setState({
                missingFieldsError: true
            });
        }

        if (!errors) {
            const user = this.props.userState.data.user;
            formData['members'] = [
                {
                    full_name: user.full_name,
                    email: user.email,
                    avatars: user.avatars,
                    experience: user.experience
                }
            ];
            this.props.dispatch(TeamsThunks.createTeam(formData));
            this.addNotification('Team Created!', 'save');
        }
    }

    onChange(formData) {
        if (formData['description']) {
            var charactersRemaining =
                40 - formData.description.length > 0
                    ? 40 - formData.description.length
                    : 0;
            this.setState({
                charactersRemaining: charactersRemaining
            });
        }
    }

    onTeamJoined() {
        this.setState({
            descriptionLengthError: false,
            missingFieldsError: false
        });
    }

    isUserInTeam(team) {
        const userEmail = this.props.userState.data.user.email;

        var inTeam = false;
        team.members.forEach(member => {
            if (member.email === userEmail) {
                inTeam = true;
            }
        });
        return inTeam;
    }

    render() {
        const teams = this.props.teamsState.data.teams;

        const userInTeam = teams.find(this.isUserInTeam) ? true : false;
        const onTeamJoined = this.onTeamJoined;

        return (
            <PagePulled ref="PageContainer">
                <Wrapper>
                    <BoxWrapper>
                        <Description>
                            Welcome to the MHacks X Team Builder! Broadcast your
                            idea to find hackers interested in joining your team
                            or find a team that you'd like to join! MHacks X is
                            featuring the adopt-a-n00b program. This means that
                            teams can have up to:{' '}
                        </Description>
                        <Bullet>- 4 members normally</Bullet>
                        <Bullet>
                            - 5 members if the team contains at least one
                            veteran hacker, with the 5th slot only being open to
                            a novice hacker{' '}
                        </Bullet>
                        <Bullet>
                            - 5 members if the team contains at least two
                            experienced hackers, with the 5th slot only being
                            open to a novice hacker
                        </Bullet>
                    </BoxWrapper>
                    {userInTeam ? (
                        <AlertContainer>
                            <Alert
                                message={'You are currently in a team'}
                                positive={true}
                            />
                        </AlertContainer>
                    ) : null}

                    {!userInTeam ? (
                        <BoxWrapper>
                            <MHForm
                                schema={this.props.teamsState.data.form}
                                FieldTypes={
                                    this.props.teamsState.data.FieldTypes
                                }
                                theme={this.props.theme}
                                onSubmit={this.onSubmit}
                                onChange={this.onChange}
                            />
                            {this.state.charactersRemaining > 0 ? (
                                <AlertContainer>
                                    <Alert
                                        message={'Description characters remaining: '.concat(
                                            this.state.charactersRemaining
                                        )}
                                    />
                                </AlertContainer>
                            ) : null}
                            {this.state.descriptionLengthError ? (
                                <AlertContainer>
                                    <Alert
                                        message={
                                            'The description must be at least 40 characters'
                                        }
                                    />
                                </AlertContainer>
                            ) : null}
                            {this.state.missingFieldsError ? (
                                <AlertContainer>
                                    <Alert
                                        message={
                                            'Missing some required fields!'
                                        }
                                    />
                                </AlertContainer>
                            ) : null}
                        </BoxWrapper>
                    ) : null}
                </Wrapper>

                <FlexBox>
                    {teams.map(function(team, i) {
                        return (
                            <TeamBox
                                key={i}
                                team={team}
                                userInTeam={userInTeam}
                                onTeamJoined={onTeamJoined}
                            />
                        );
                    })}
                </FlexBox>
                <NotificationStack
                    notifications={this.state.notifications.toArray()}
                    onDismiss={notification =>
                        this.setState({
                            notifications: this.state.notifications.delete(
                                notification
                            )
                        })
                    }
                />
            </PagePulled>
        );
    }
}

TeamBuilding.contextTypes = {
    router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        userState: state.userState,
        teamsState: state.teamsState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(TeamBuilding);
