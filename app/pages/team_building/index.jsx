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
    minWidth: 80%
`;

class TeamBuilding extends React.Component {
    componentDidMount() {
        this.props.dispatch(TeamsThunks.loadTeamForm());
        this.props.dispatch(TeamsThunks.loadTeams());

        // refresh team every 20 seconds
        this.poll = setInterval(() => {
            this.props.dispatch(TeamsThunks.loadTeams());
        }, 20 * 1000);

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.poll);
    }

    onSubmit(formData) {
        console.log(formData);
        this.props.dispatch(TeamsThunks.createTeam(formData));
    }

    render() {
        const teams = this.props.teamsState.data.teams;

        return (
            <PageContainer>
                <FlexBox>
                    <MHFormWrapper>
                        <MHForm
                            schema={this.props.teamsState.data.form}
                            FieldTypes={this.props.teamsState.data.FieldTypes}
                            theme={this.props.theme}
                            onSubmit={this.onSubmit}
                        />
                    </MHFormWrapper>
                    {teams.map(function(team, i) {
                        return <TeamBox key={i} team={team} />;
                    })}
                </FlexBox>
            </PageContainer>
        );
    }
}

TeamBuilding.contextTypes = {
    router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        teamsState: state.teamsState,
        theme: state.theme.data
    };
}

export default connect(mapStateToProps)(TeamBuilding);
