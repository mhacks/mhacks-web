import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles';
import { PageContainer } from '../../components';

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
    width: 25%;
`;

const ChatContainer = styled.div`
    width: 75%;
`;

class LivePage extends React.Component {
    render() {
        return (
            <PageContainer>
                <Content>
                    <AnnouncementsContainer>
                        <p>Announcements</p>
                    </AnnouncementsContainer>
                    <ChatContainer>
                        <p>Chat</p>
                    </ChatContainer>
                </Content>
            </PageContainer>
        );
    }
}

export default LivePage;
