import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { devices } from '../../styles';
import Announcements from './announcements.jsx';
import { Countdown } from '../../components';
import Chat from './chat';

const verticalMargin = 130;

const Container = styled.div`
    display: flex;
    width: calc(100% - 40px);
    margin: ${verticalMargin}px auto 0 auto;
    overflowX: hidden;
    flexDirection: column;
    position: relative;
    height: calc(100vh - ${verticalMargin*2}px);

    ${devices.small`
        width: calc(100% - 60px);
    `}

    ${devices.tablet`
        height: calc(100vh - ${verticalMargin*2}px);
        margin: ${verticalMargin}px auto;
    `}
`;

const Content = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    overflowX: hidden;
`;

const AnnouncementsContainer = styled.div`
    width: 33%;
    overflowY: scroll;
`;

const ChatContainer = styled.div`
    width: 67%;
    height: 100%;
    borderRadius: 8px;
    backgroundColor: #999999;
    position: relative;
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
                    <ChatContainer bgcolor={this.props.theme.teal}>
                        <Chat />
                    </ChatContainer>
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state){
    return {
        theme: state.theme.data
    }
}

export default connect(mapStateToProps)(LivePage);
