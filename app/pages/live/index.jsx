import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import Announcements from './announcements.jsx';

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
            <div>
                <Content>
                    <AnnouncementsContainer>
                        <Announcements />
                    </AnnouncementsContainer>
                    <ChatContainer>
                        <p>Chat</p>
                    </ChatContainer>
                </Content>
            </div>
        );
    }
}

export default LivePage;
