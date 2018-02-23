import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { devices } from '../../styles';

import {
    PageContainer,
    Container,
    Countdown,
    FullScreenAnimation
} from '../../components';
import LinkList from './link_list.jsx';
import Announcements from './announcements.jsx';
import Schedule from './schedule.jsx';
import Mentorship from './mentorship.jsx';
import Hardware from './hardware.jsx';
import Resources from './resources.jsx';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const PagePulled = styled(PageContainer)`
    min-height: calc(100vh - 146px);
    background-color: ${props => props.theme.secondary};
    overflow: hidden;
`;

const Row = styled.div`
    height: 500px;
    margin-bottom: 20px;
`;

const Double = styled.div`
    display: flex;
    flex-direction: column;

    div {
        width: calc(100%);
        margin-bottom: 20px;

        ${devices.tablet`
            width: calc(50% - 20px);
            margin-bottom: 0;
        `};
    }

    ${devices.tablet`
        flex-direction: row;
        justify-content: space-between;
    `};
`;

class LivePage extends React.Component {
    render() {
        return (
            <PagePulled>
                <Container>
                    <FullScreenAnimation />
                    <Countdown
                        date={this.props.configurationState.data.end_date}
                        fallback="Submissions Closed!"
                    />
                    <LinkList />
                    <Row>
                        <Announcements />
                    </Row>
                    <Row>
                        <Schedule />
                    </Row>
                    <Row>
                        <Mentorship />
                    </Row>
                    <Double>
                        <Hardware />
                        <Resources />
                    </Double>
                </Container>
            </PagePulled>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme.data,
        configurationState: state.configurationState
    };
}

export default connect(mapStateToProps)(LivePage);
