import React from 'react';
import styled from 'styled-components';

const Avatar = styled.img`
    width: inherit; 
    minWidth: 100px;   
    maxWidth: 200px;
`;

export default class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profilePicture: this.props.avatars[0] || '',
            counter: 0
        };

        this.handleImageError = this.handleImageError.bind(this);
    }

    handleImageError() {
        var avatars = this.props.avatars;
        var counter = this.state.counter + 1;
        var next = avatars[counter];
        this.setState({
            profilePicture: next,
            counter: counter
        });
    }

    render() {
        return (
            <Avatar
                onError={this.handleImageError}
                src={this.state.profilePicture}
            />
        );
    }
}
