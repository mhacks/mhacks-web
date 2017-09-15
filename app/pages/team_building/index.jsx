import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { PageContainer } from '../../components';
import TeamBox from './team_box.jsx';
import { TeamsThunks } from '../../actions';

const FlexBox = styled.div`
    display: flex;
    flexWrap: wrap;
`;


class TeamBuilding extends React.Component {
    componentDidMount() {
        this.props.dispatch(TeamsThunks.loadTeams());

        // refresh team every 20 seconds
        this.poll = setInterval(() => {
            this.props.dispatch(TeamsThunks.loadTeams());
        }, 20 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.poll);
    }

    render() {
        const teams = this.props.teamsState.data;

        return (
            <PageContainer>
                <FlexBox>
                    {teams.map(function(team, i) {
                        return (
                            <TeamBox key={i} team={team}/>
                        );
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
        teamsState: state.teamsState
    };
}

export default connect(mapStateToProps)(TeamBuilding);
