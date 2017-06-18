import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    color: #d8000c;
    background-color: #ffbaba;
    textAlign: center;
    borderRadius: 10px;
`;

const Message = styled.p`
    padding: 10px;
    margin: 0;
`;

class Alert extends React.Component {
    render() {
        return (
            <Wrapper>
                <Message>{this.props.message}</Message>
            </Wrapper>
        );
    }
}

export default Alert;
