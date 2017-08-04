import React from 'react';
import styled from 'styled-components';

//import { Container } from '../components';
//import { devices } from '../styles';
//

const InfoContainer = styled.div`
    display: flex;
    flexDirection: column;
    backgroundColor: lightgray;
    padding: 20px;
`;

const P = styled.p`
    margin: 0;
`;

class ProfilePreview extends React.Component {
    render() {
        const { user } = this.props;

        return (
            <div>
                <InfoContainer>
                    <P>{user.name}</P>
                    <P>{user.university}</P>
                    <P>{user.major}</P>
                </InfoContainer>
            </div>
        );
    }
}

export default ProfilePreview;
