import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import Announcements from './announcements.jsx';
import { Countdown } from '../../components';

const verticalMargin = 130;

const Container = styled.div`
    display: flex;
    height: 100%;
    width: calc(100% - 40px);
    margin: ${verticalMargin}px auto 0 auto;
    overflowX: hidden;
    flexDirection: column;

    ${devices.small`
        width: calc(100% - 60px);
    `}

    ${devices.tablet`
        height: calc(100vh - ${verticalMargin*2}px);
        margin: ${verticalMargin}px auto;
    `}
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    display: flex;

    ${devices.tablet`
        width: 100%;
        overflowX: hidden;
        overflowY: scroll;
    `}
`;

const AnnouncementsContainer = styled.div`
    width: 33%;
`;

const ChatContainer = styled.div`
    width: 67%;
`;

class LivePage extends React.Component {
    render() {
        return (
            <Container>
                <Countdown
                    date={'Thur, 24 June 2017 21:00:00 EDT'}
                    fallback="Submissions Closed!"
                />
                <Content>
                    <AnnouncementsContainer>
                        <Announcements />
                    </AnnouncementsContainer>
                    <ChatContainer>
                        <p>Chat</p>
                    </ChatContainer>
                </Content>
            </Container>
        );
    }
}

export default LivePage;
