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
    flexWrap: wrap;
    justifyContent: center;
    alignItems: center;
`;

const MHFormWrapper = styled.div`
    borderRadius: 25px;
    border: 3px solid ${props => props.theme.primary};
    margin: 20px;
    padding: 20px;
    minWidth: 80%;
    display: inline-block;
`;

const Wrapper = styled.div`
    display: flex;
    flexDirection: column;
    alignItems: center;
`;

const AlertContainer = styled.div`
    margin: 10px;
    minWidth: 80%;
`;

const PagePulled = styled(PageContainer)`min-height: calc(100vh - 146px);`;

class TeamBuilding extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: OrderedSet(),
            descriptionLengthError: false,
            missingFieldsError: false
        };

        this.onSubmit = this.onSubmit.bind(this);
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

        if (!formData.description || formData.description.length < 100) {
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
            this.props.dispatch(TeamsThunks.createTeam(formData));
            this.addNotification('Team Created!', 'save');
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
                    {userInTeam ? (
                        <AlertContainer>
                            <Alert
                                message={'You are currently in a team'}
                                positive={true}
                            />
                        </AlertContainer>
                    ) : null}

                    {!userInTeam ? (
                        <MHFormWrapper>
                            <MHForm
                                schema={this.props.teamsState.data.form}
                                FieldTypes={
                                    this.props.teamsState.data.FieldTypes
                                }
                                theme={this.props.theme}
                                onSubmit={this.onSubmit}
                            />
                        </MHFormWrapper>
                    ) : null}
                    {this.state.descriptionLengthError ? (
                        <AlertContainer>
                            <Alert
                                message={
                                    'The description must be at least 100 characters'
                                }
                            />
                        </AlertContainer>
                    ) : null}
                    {this.state.missingFieldsError ? (
                        <AlertContainer>
                            <Alert message={'Missing some required fields!'} />
                        </AlertContainer>
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
                        })}
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
