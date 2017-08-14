import React from 'react';
import styled from 'styled-components';

const Avatar = styled.img`
    width: inherit;    
`;

export default class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profilePicture: this.props.avatars[0] || ''
        };

        this.handleImageError = this.handleImageError.bind(this);
    }

    handleImageError() {
        var avatars = this.props.avatars;
        var fallback = avatars[avatars.length - 1];
        this.setState({
            profilePicture: fallback
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
