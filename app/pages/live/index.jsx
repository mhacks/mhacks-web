import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import {
    PageContainer,
    Container,
    Countdown,
    FullScreenAnimation
} from '../../components';
import Announcements from './announcements.jsx';
import Chat from './chat';

const PagePulled = styled(PageContainer)`
    min-height: calc(100vh - 146px);
    backgroundColor: ${props => props.theme.secondary};
    overflow: hidden;
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
                    <Announcements />

                    <Chat />
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
