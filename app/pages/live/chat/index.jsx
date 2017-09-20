import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';
import Favicon from '../../../../static/nano/favicon.png';
import List from 'react-list';

//import InputBar from './InputBar.jsx';
import Components from '../components.jsx';
const { SectionWrapper, SectionHeader } = Components;

const ListItemHeader = styled.h2`
    color: ${props => props.theme.highlight};
    margin: 0;
    fontSize: 20px;
    fontWeight: bold;
`;

const ListItemTimestamp = styled.p`
    fontWeight: bold;
    marginTop: 7px;
    color: ${props => props.theme.highlight};
`;

const ListItemDescription = styled.p`color: white;`;

const Seperator = styled.div`
    background: ${props => props.theme.highlight};
    height: 2px;
    margin: 15px 20px 15px 0;
`;

/*
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
*/

class Chat extends React.Component {
    constructor() {
        super();

        this.state = { messages: [], users: [] };

        this.inputSubmit = this.inputSubmit.bind(this);
        this.renderItem = this.renderItem.bind(this);
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
                    data.channels.forEach(function(channel) {
                        var users = [];
                        for (var i in channel.members) {
                            users.push(channel.members[i]);
                        }

                        component.setState(state => ({
                            users: users,
                            channel: channel,
                            messages: state.messages
                        }));
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
        var element = document.getElementById('lastItem');
        if (element) {
            element.scrollIntoView();
        }
    }

    renderItem(index, key) {
        const messages = this.state.messages;
        const message = messages[index];

        return (
            <div key={key}>
                <ListItemHeader theme={this.props.theme}>
                    {message.user.name}
                </ListItemHeader>
                <ListItemTimestamp theme={this.props.theme}>
                    <FormattedRelative value={message.time} />
                </ListItemTimestamp>
                <ListItemDescription theme={this.props.theme}>
                    {message.message}
                </ListItemDescription>
                <Seperator />
            </div>
        );
    }

    render() {
        if (!this.props || !this.props.shouldRender) {
            return (
                <SectionWrapper>
                    <SectionHeader>Login to Access Chat</SectionHeader>
                </SectionWrapper>
            );
        } else {
            var users = [];
            this.state.users.forEach(function(data) {
                users.push(data.name);
            });

            return (
                <SectionWrapper>
                    <SectionHeader>
                        {this.state.isDisconnected ? (
                            'You have been disconnected.'
                        ) : (
                            'Chat with ' + (users.length > 0 ? users.length - 1 : '0') + (' other ') + (users.length - 1 === 1 ? 'user' : 'users')
                        )}
                    </SectionHeader>
                    <div style={{ overflow: 'auto', height: 'calc(100% - 44px)' }}>
                        <List
                            itemRenderer={this.renderItem}
                            length={this.state.messages.length}
                            type="variable"
                            threshold={200}
                        />
                    </div>
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
