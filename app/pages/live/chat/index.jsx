import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';

import InputBar from './InputBar.jsx';

const Wrapper = styled.div` 
`

const Header = styled.div`
    backgroundColor: #E6E6E6;
    borderRadius: 8px 8px 0 0;
    padding: 10px;
    border: 1px solid gray;
`

const HeaderText = styled.h3`
    margin: 0;
`

const List = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
`;

const ListItem = styled.div`
    backgroundColor: #EFEFEF;
    borderBottom: 0.5px solid black;
    padding: 10px;
`;

const ListItemHeader = styled.h2`
    color: darkorange;
    margin: 0;
    fontSize: 14px;
`;

const ListItemTimestamp = styled.span`
    display: inline;
    fontWeight: bold;
    color: gray;
    fontSize: 12px;
    margin: 0;
    marginLeft: 5px;
    position: relative;
    top: -1px;
`;

const ListItemDescription = styled.p`
    color: gray;
    margin: 0;
`;

class Chat extends React.Component {

    constructor() {
        super();

        this.state = {messages: []};

        this.inputSubmit = this.inputSubmit.bind(this);
    }

    componentDidMount() {
        if (!this.props || !this.props.shouldRender) {
            return false;
        }

        this.socket = io.connect(window.location.origin, {
            reconnection: false
        });

        let component = this;

        this.socket.on('authenticate', function (data) {
            console.log('Authenticate', data);
            if (!data) {
                component.authenticate(component.props.token);
            } else {
                component.retrieveProfile();
            }
        });

        this.socket.on('status', function (data) {
            console.log('Status', data);
        });

        this.socket.on('chat', function (data) {
            console.log('Chat', data);

            component.setState(state => ({
                messages: [...state.messages, data]
            }));
        });

        this.socket.on('channels', function (data) {
            console.log('Channels', data);
        });
    }

    sendMessage(message, channel) {
        this.socket.emit('chat', {
            message,
            channel
        });
    }

    retrieveProfile() {
        this.socket.emit('profile');
        this.socket.on('profile', function (data) {
            console.log('Profile', data);
            this.profileData = data;
        });
    }

    authenticate(token) {
        this.socket.emit('authenticate', {
            token
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    inputSubmit(message) {
        this.sendMessage(message, '#general');
    }

    render(){
        if (!this.props || !this.props.shouldRender) {
            return null;
        } else {
            return (
                <Wrapper>
                    <Header>
                        <HeaderText>Chat</HeaderText>
                    </Header>
                    <List>
                        {this.state.messages.map(function (message, i) {
                            var element = document.getElementById('lastItem')
                            element && element.scrollIntoView(false);
                            return (
                                <ListItem key={i} id={i == this.state.messages.length - 1 && 'lastItem'}>
                                    <ListItemHeader>{message.user.name} 
                                        <ListItemTimestamp>
                                            <FormattedRelative value={message.time} />
                                        </ListItemTimestamp>
                                    </ListItemHeader>
                                    <ListItemDescription>{message.message}</ListItemDescription>
                                </ListItem>
                            );
                        }.bind(this))}
                    </List>
                    <InputBar onSubmit={this.inputSubmit} />
                </Wrapper>
            );
        }
    }
}

function mapStateToProps(state){
    return {
        token: state.userState.data.token,
        theme: state.theme.data,
        shouldRender: !!state.userState.data.token
    }
}

export default connect(mapStateToProps)(Chat);