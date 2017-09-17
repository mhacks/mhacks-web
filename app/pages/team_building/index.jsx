import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { PageContainer, MHForm } from '../../components';
import TeamBox from './team_box.jsx';
import { TeamsThunks } from '../../actions';

const FlexBox = styled.div`
    display: flex;
    flexWrap: wrap;
    justifyContent: center;
`;

const MHFormWrapper = styled.div`
    borderRadius: 25px;
    border: 2px solid ${props => props.theme.secondary};
    textAlign: center;
    margin: 20px;
    padding: 20px;
    minWidth: 80%;
`;

const PagePulled = styled(PageContainer)`min-height: calc(100vh - 146px);`;

class TeamBuilding extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.isUserInTeam = this.isUserInTeam.bind(this);
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
        this.props.dispatch(TeamsThunks.createTeam(formData));
    }

    isUserInTeam(team) {
        const userEmail = this.props.userState.data.user.email;

        var inTeam = false;
        team.members.forEach(function(member) {
            if (member.email === userEmail) {
                inTeam = true;
            }
        });
        return inTeam;
    }

    render() {
        const teams = this.props.teamsState.data.teams;

        const userInTeam = teams.find(this.isUserInTeam) ? true : false;

        return (
            <PagePulled ref="PageContainer">
                <FlexBox>
                    <MHFormWrapper>
                        {userInTeam ? null : (
                            <MHForm
                                schema={this.props.teamsState.data.form}
                                FieldTypes={
                                    this.props.teamsState.data.FieldTypes
                                }
                                theme={this.props.theme}
                                onSubmit={this.onSubmit}
                            />
                        )}
                    </MHFormWrapper>
                    {teams.map(function(team, i) {
                        return (
                            <TeamBox
                                key={i}
                                team={team}
                                userInTeam={userInTeam}
                            />
                        );
                    })}
                </FlexBox>
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
