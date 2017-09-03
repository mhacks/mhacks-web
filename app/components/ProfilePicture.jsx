import React from 'react';
import styled from 'styled-components';

const Avatar = styled.img`
    width: inherit;
    minWidth: 100px;
    maxWidth: 200px;
`;

const BackupPicture = styled.div`
    backgroundColor: gray;
    width: 100px;
    height: 100px;
`;

export default class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);

        const avatars = this.props.avatars;

        this.state = {
            profilePicture: avatars && avatars.length > 0 ? avatars[0] : '',
            counter: 0,
            isValidPicture: true
        };

        this.handleImageError = this.handleImageError.bind(this);
    }

    handleImageError() {
        const avatars = this.props.avatars;
        const counter = this.state.counter + 1;

        if (!avatars || counter > avatars.length) {
            this.setState({
                isValidPicture: false
            });
        } else {
            this.setState({
                profilePicture: avatars[counter],
                counter: counter
            });
        }
    }

    render() {
        if (!this.state.isValidPicture) {
            return <BackupPicture />;
        }

        return (
            <Avatar
                onError={this.handleImageError}
                src={this.state.profilePicture}
            />
        );
    }
}
