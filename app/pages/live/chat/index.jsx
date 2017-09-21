import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import styled from 'styled-components';
import Favicon from '../../../../static/nano/favicon.png';

import InputBar from './InputBar.jsx';
import Message from './Message.jsx';
import Components from '../components.jsx';
const { SectionWrapper, SectionHeader } = Components;

const ContentContainer = styled.div`
    display: flex;
    height: calc(100% - 100px);
`;

const Sidebar = styled.div`margin-right: 20px;`;

const ChatContainer = styled.div`flex-grow: 1;`;

const ListContainer = styled.div`
    overflow: auto;
    height: 100%;
`;

const ChannelLink = styled.p`
    color: ${props => props.theme.highlight};
    text-decoration: ${props => (props.active ? 'underline' : 'none')};

    &:hover {
        text-decoration: underline;
    }
`;

class Chat extends React.Component {
    constructor() {
        super();

        this.state = { messages: [], users: [], channels: [], channel: {} };

        this.inputSubmit = this.inputSubmit.bind(this);
    }

    componentDidMount() {
        if (!this.props || !this.props.shouldRender) {
            return false;
        }

        this.requestPermissions(function() {
            console.log('Got permissions');
        });

        this.socket = io.connect(window.location.origin, {
            reconnection: false
        });

        window.socket = this.socket;

        let component = this;

        this.socket.on('authenticate', function(data) {
            if (!data) {
                component.authenticate(component.props.token);
            } else {
                component.retrieveProfile();

                component.socket.on('channels', function(data) {
                    console.log('Channels', data);
                    const seenUsers = {};
                    var users = [];

                    data.channels.forEach(channel => {
                        channel.members.forEach(member => {
                            if (!seenUsers.hasOwnProperty(member.id)) {
                                users.push(member);
                                seenUsers[member.id] = true;
                            }
                        });
                    });

                    component.setState({
                        users: users,
                        channel:
                            data.channels.length > 0
                                ? data.channels[0]
                                : undefined,
                        channels: data.channels
                    });
                });

                component.socket.on('privatemessages', function(data) {
                    console.log('Privatemessages', data);
                });

                setTimeout(function() {
                    component.socket.emit('channels');
                    component.socket.emit('privatemessages');
                }, 1000);
            }
        });

        this.socket.on('status', function(data) {
            if (!data.status) {
                alert(data.message);
            }
        });

        this.socket.on('disconnect', () => {
            this.setState({
                isDisconnected: true
            });
        });

        this.socket.on('chat', function(data) {
            if (!document.hasFocus() && 'Notification' in window) {
                if (Notification.permission === 'granted') {
                    component.createNotification(data);
                } else if (Notification.permission !== 'denied') {
                    component.requestPermissions(function() {
                        component.createNotification(data);
                    });
                }
            }

            component.setState(state => ({
                messages: [...state.messages, data],
                users: state.users
            }));
        });
    }

    // array of user ids
    createPrivateMessage(users) {
        if (Array.isArray(users)) {
            var members = users.map(function(user) {
                return {
                    _id: user
                };
            });

            this.socket.emit('privatemessage', members);
        } else {
            return false;
        }
    }

    requestPermissions(func) {
        if ('Notification' in window) {
            Notification.requestPermission(function(permission) {
                if (permission === 'granted') {
                    func();
                }
            });
        }
    }

    createNotification(data) {
        var notification = new Notification('#general: ' + data.user.name, {
            icon: Favicon,
            body: data.message
        });

        notification.onclick = function(event) {
            event.preventDefault();
            window.focus();
            notification.close();
        };

        setTimeout(function() {
            notification.close();
        }, 5000);

        return notification;
    }

    sendMessage(message, channel) {
        this.socket.emit('chat', {
            message,
            channel
        });
    }

    retrieveProfile() {
        this.socket.emit('profile');
        this.socket.on('profile', function(data) {
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
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    inputSubmit(message) {
        this.setState(state => ({
            users: state.users,
            messages: state.messages,
            topPadding: '23px'
        }));

        if (this.state.channel) {
            this.sendMessage(message, this.state.channel.id);
        }
    }

    componentDidUpdate() {
        var element = document.getElementById('lastMessage');
        if (element) {
            element.parentNode.scrollTop = element.offsetTop;
        }
    }

    render() {
        if (!this.props || !this.props.shouldRender) {
            return (
                <SectionWrapper>
                    <SectionHeader>Login to Access Chat</SectionHeader>
                </SectionWrapper>
            );
        } else {
            const userCount = this.state.users.length;
            const filtered = this.state.messages.filter(message => {
                return message.channel === this.state.channel.id;
            });

            return (
                <SectionWrapper>
                    <SectionHeader>
                        {this.state.isDisconnected ? (
                            'You have been disconnected.'
                        ) : (
                            'Chat with ' +
                            (userCount > 0 ? userCount - 1 : '0') +
                            ' other ' +
                            (userCount - 1 === 1 ? 'user' : 'users')
                        )}
                    </SectionHeader>
                    <ContentContainer>
                        <Sidebar>
                            {this.state.channels.map((channel, index) => {
                                return (
                                    <ChannelLink
                                        key={index}
                                        onClick={() => {
                                            this.setState({
                                                channel: channel
                                            });
                                        }}
                                        theme={this.props.theme}
                                        active={
                                            this.state.channel.id === channel.id
                                        }
                                    >
                                        {channel.name}
                                    </ChannelLink>
                                );
                            })}
                        </Sidebar>
                        <ChatContainer>
                            <ListContainer>
                                {filtered.map((message, index) => {
                                    const isLast =
                                        index === filtered.length - 1;
                                    return (
                                        <Message
                                            key={index}
                                            message={message}
                                            isLast={isLast}
                                        />
                                    );
                                })}
                            </ListContainer>
                            <InputBar onSubmit={this.inputSubmit} />
                        </ChatContainer>
                    </ContentContainer>
                </SectionWrapper>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        token: localStorage.getItem('jwt'),
        theme: state.theme.data,
        shouldRender: !!localStorage.getItem('jwt')
    };
}

export default connect(mapStateToProps)(Chat);
