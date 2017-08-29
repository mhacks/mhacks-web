import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';
import Favicon from '../../../../static/nano/favicon.png';

import InputBar from './InputBar.jsx';

const Wrapper = styled.div`height: 100%;`;

const Header = styled.div`
    backgroundColor: #e6e6e6;
    borderRadius: 8px 8px 0 0;
    padding: 10px;
    border: 1px solid gray;
`;

const HeaderText = styled.h3`
    margin: 0;
    fontSize: 22px;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    overflowY: scroll;
    height: calc(100% - 48px - 35px);
`;

const ListItem = styled.div`
    backgroundColor: #efefef;
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

        this.state = { messages: [], users: [] };

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

        let component = this;

        this.socket.on('authenticate', function(data) {
            if (!data) {
                component.authenticate(component.props.token);
            } else {
                component.retrieveProfile();
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
            if (data.channel === '#general') {
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
            }
        });

        this.socket.on('channels', function(data) {
            data.channels.forEach(function(channel) {
                if (channel.name === '#general') {
                    var users = [];
                    for (var i in channel.members) {
                        users.push(channel.members[i]);
                    }

                    component.setState(state => ({
                        users: users,
                        messages: state.messages
                    }));
                }
            });
        });
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
        this.socket.disconnect();
    }

    inputSubmit(message) {
        this.setState(state => ({
            users: state.users,
            messages: state.messages,
            topPadding: '23px'
        }));
        this.sendMessage(message, '#general');
    }

    componentDidUpdate() {
        var element = document.getElementById('lastItem');
        if (element) {
            element.scrollIntoView();
        }
    }

    render() {
        if (!this.props || !this.props.shouldRender) {
            return (
                <Wrapper>
                    <Header>
                        <HeaderText>Login to Access Chat</HeaderText>
                    </Header>
                </Wrapper>
            );
        } else {
            var users = [];
            this.state.users.forEach(function(data) {
                users.push(data.name);
            });

            return (
                <Wrapper>
                    <Header>
                        {this.state.isDisconnected
                            ? <HeaderText>
                                  You have been disconnected.
                              </HeaderText>
                            : <HeaderText>
                                  Chat with{' '}
                                  {users.length > 0
                                      ? users.length - 1
                                      : '0'}{' '}
                                  other{' '}
                                  {users.length - 1 === 1 ? 'user' : 'users'}
                              </HeaderText>}
                    </Header>
                    <List>
                        {this.state.messages.map(
                            function(message, i) {
                                var propId =
                                    i === this.state.messages.length - 1
                                        ? 'lastItem'
                                        : '';
                                return (
                                    <ListItem key={i} id={propId}>
                                        <ListItemHeader>
                                            {message.user.name}
                                            <ListItemTimestamp>
                                                <FormattedRelative
                                                    value={message.time}
                                                />
                                            </ListItemTimestamp>
                                        </ListItemHeader>
                                        <ListItemDescription>
                                            {message.message}
                                        </ListItemDescription>
                                    </ListItem>
                                );
                            }.bind(this)
                        )}
                    </List>
                    <InputBar onSubmit={this.inputSubmit} />
                </Wrapper>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        token: state.userState.data.token,
        theme: state.theme.data,
        shouldRender: !!state.userState.data.token
    };
}

export default connect(mapStateToProps)(Chat);
