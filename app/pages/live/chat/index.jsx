import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import InputBar from './InputBar.jsx';

class Chat extends React.Component {

    componentDidMount() {
        this.socket = io.connect(window.location.origin, {
            reconnection: false
        });

        let component = this;

        this.socket.on('authenticate', function (data) {
            console.log('Authenticate', data);
            if (!data) {
                component.authenticate(this.props.token);
            } else {
                component.retrieveProfile();
            }
        });

        this.socket.on('status', function (data) {
            console.log('Status', data);
        });

        this.socket.on('chat', function (data) {
            console.log('Chat', data);
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
        console.log(message)
    }

    render(){
        return (
            <div>chat here
                <InputBar onSubmit={this.inputSubmit} />
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        token: state.userState.data.token
    }
}

export default connect(mapStateToProps)(Chat);