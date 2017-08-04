import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
    display: flex;
    flexDirection: column;
    padding: 20px;
`;

const P = styled.p`
    margin: 0;
`;

class ApplicationProgress extends React.Component {
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

export default ApplicationProgress;
